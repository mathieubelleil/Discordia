const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment, TextChannel, MessageButton, MessageActionRow } = require('discord.js');
const { token, guildId } = require('../config.json');

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getEmbeds(player, monster){
  const monsterEmbed = new MessageEmbed()
    .setDescription(monster.name+' : '+monster.health+' PV');
  const playerEmbed = new MessageEmbed()
    .setDescription(player.discord_id+' : '+player.health+' PV');
  const embed = []
  embed.push(monsterEmbed, playerEmbed);
  return embed;
}

function dodgeTest(dodge) {
  const dice = getRandomInteger(0, 100);
  if (dodge > dice){
    return true
  } else {return false;}
}

function playerAttack(player, monster) {
  let content = ''
  if (dodgeTest(monster.dodge)) {
    content = 'L\'adversaire évite le coup ! '
  } else {
    if ((monster.attack + monster.damage) > player.armor) {
      let lostHP = (player.attack + player.damage) - monster.armor;
      monster.health -= lostHP;
      content = 'Pan ! Dans les dents ! Ton adversaire perd ' + lostHP + 'PV ! '
    } else {
      content = 'Le coup donné est trop faible pour infliger la moindre égratignure. '
    }
  }
  return content
}

function monsterSimpleAttack(monster, player) {
  let content = ''
  if (dodgeTest(player.dodge)) {
    content = 'L\'adversaire ne parvient pas à te toucher !'
  } else {
    if ((monster.attack + monster.damage) > player.armor) {
      let lostHP = (monster.attack + monster.damage) - player.armor;
      player.health -= lostHP;
      content = 'Tu reçois un coup te faisant perdre '+ lostHP + 'PV ! '
    } else {
      content = 'Le coup reçu est trop faible pour recevoir la moindre égratignure. '
    }
  }
  return content
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('fight an encountered enemy'),
  async execute(client, interaction) {
    const guild = await client.guilds.cache.get(guildId);
    const member = await guild.members.cache.get(interaction.user.id)
    const encounterRole = member.roles.cache.find(role => role.name.startsWith('VS'))
    if (!encounterRole) {
        interaction.reply({ content: 'Il n\'y a rien à combattre !', ephemeral: true, embeds: [], components: [] });;
    } else {
      let encounter = encounterRole.name.split('VS')
      encounter = encounter[1]
      connection.query('SELECT * FROM monsters WHERE name = \'' + encounter + '\'', function (error, results, fields) {
        if (error) throw error;
        const monster = results[0]
        connection.query('SELECT * FROM players WHERE discord_id = \'' + member + '\'', (error, results, fields) => {
          if (error) throw error;
          const player = results[0]
          let embed = getEmbeds(player, monster)
          let emojiAttack = client.emojis.cache.find(emoji => emoji.name == 'attack')
          const buttonAttack = new MessageButton()
            .setCustomId('Attack')
            .setLabel("Attaquer")
            .setStyle('PRIMARY')
            .setEmoji(emojiAttack.id)
          const buttonFinish = new MessageButton()
            .setCustomId('Finish')
            .setLabel("Finish")
            .setStyle('PRIMARY')
            .setEmoji(emojiAttack.id)
          let buttons = []
          buttons.push(buttonAttack)
          let components = new MessageActionRow().addComponents(buttons);
          interaction.reply({ content: player.discord_id +  ', vous faites face à ' + monster.name, ephemeral: true, embeds: getEmbeds(player, monster), components: [components] }).then(async msg => {
            let round = 1;
            let fightResult;
            let playerResult;
            let monsterResult;
            await client.on('interactionCreate', async interactionButton => {
              await interactionButton.deferUpdate();
              if(interactionButton.isButton()){
                const action = interactionButton.customId;
                if (action === "Attack") {
                  playerResult = playerAttack(player, monster);
                } else if (action === 'Finish') {

                } else {
                  console.log("Normally impossible to see this console log");
                  //Add other actions to do (drink potions, cast spells, shoot arrows...)
                }

                //Monster action :
                monsterResult = monsterSimpleAttack(monster, player);

                //Check if opponent or player is dead :
                if (player.health < 1) {
                  fightResult = 'Tu as péri, ton nom sera probablement oublié, mais tu peux toujours recréer un personnage pour espérer entrer dans la légende.'
                  components = new MessageActionRow().addComponents(buttonFinish)
                } else if (monster.health < 1) {
                  fightResult = 'Bien joué, tu as triomphé et peux dépouiller ton adversaire en toute quiétude !'
                  components = new MessageActionRow().addComponents(buttonFinish)
                } else {
                  fightResult = 'Le combat peut continuer...'
                }

                interaction.editReply({ content: playerResult + monsterResult + fightResult, ephemeral: true, embeds: getEmbeds(player, monster), components: [components]})
              }
            })
          });
        });
      });
    }
  }
}
