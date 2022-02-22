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
    .setDescription(monster.nom+' : '+monster.pv+' PV');
  const playerEmbed = new MessageEmbed()
    .setDescription(player.discord_id+' : '+player.pv+' PV');
  const embed = []
  embed.push(monsterEmbed, playerEmbed);
  return embed;
}

function dodgeDice(esq) {
  const dice = getRandomInteger(0, 100);
  if (esq > dice){
    return true
  } else {return false;}
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
      connection.query('SELECT * FROM monsters WHERE nom = \'' + encounter + '\'', function (error, results, fields) {
        if (error) throw error;
        const monster = results[0]
        connection.query('SELECT * FROM players WHERE discord_id = \'' + member + '\'', (error, results, fields) => {
          if (error) throw error;
          const player = results[0]
          var embed = getEmbeds(player, monster)
          var emojiAttack = client.emojis.cache.find(emoji => emoji.name == 'attack')
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
          var buttons = []
          buttons.push(buttonAttack)
          var components = new MessageActionRow().addComponents(buttons);
          interaction.reply({ content: player.discord_id +  ', vous faites face à ' + monster.nom, ephemeral: true, embeds: getEmbeds(player, monster), components: [components] }).then(async msg => {
            var round = 1;
            await client.on('interactionCreate', interactionButton => {
              if(interactionButton.isButton()){
                const action = interactionButton.customId;
                if (action === "Attack") {
                  const messageContent = []
                  var monsterEsq = getRandomInteger(0, 100);
                  if (dodgeDice(monster.esq)) {
                    messageContent['playerResult'] = 'L\'adversaire évite le coup ! '
                  } else {
                    if ((monster.attaque + monster.dg) > player.arm) {
                      var lostHP = (player.attaque + player.dg) - monster.arm;
                      monster.pv -= lostHP;
                      messageContent['playerResult'] = 'Pan ! Dans les dents ! Ton adversaire perd ' + lostHP + 'PV ! '
                    } else {
                      messageContent['monsterResult'] = 'Le coup donné est trop faible pour infliger la moindre égratignure. '
                    }
                  }
                  if (dodgeDice(player.esq)) {
                    messageContent['monsterResult'] = 'L\'adversaire ne parvient pas à te toucher !'
                  } else {
                    if ((monster.attaque + monster.dg) > player.arm) {
                      var lostHP = (monster.attaque + monster.dg) - player.arm;
                      player.pv -= lostHP;
                      messageContent['monsterResult'] = 'Tu reçois un coup te faisant perdre '+ lostHP + 'PV ! '
                    } else {
                      messageContent['monsterResult'] = 'Le coup reçu est trop faible pour recevoir la moindre égratignure. '
                    }
                  }
                  if (player.pv < 500) {
                    messageContent['fightResult'] = 'Tu as péri, ton nom sera probablement oublié, mais tu peux toujours recréer un personnage pour espérer entrer dans la légende.'
                    components = new MessageActionRow().addComponents(buttonFinish)
                  } else if (monster.pv < 1) {
                    messageContent['fightResult'] = 'Bien joué, tu as triomphé et peux dépouiller ton adversaire en toute quiétude !'
                    components = new MessageActionRow().addComponents(buttonFinish)
                  } else {
                    messageContent['fightResult'] = 'Le combat peut continuer...'
                  }
                  interaction.editReply({ content: messageContent['playerResult'] + messageContent['monsterResult'] + messageContent['fightResult'], ephemeral: true, embeds: getEmbeds(player, monster), components: [components]})
                } else {
                  console.log("Normally impossible to see this console log");
                  //Add other actions to do (drink potions, cast spells, shoot arrows...)
                }
              }
            })
          });
        });
      });
    }
  }
}
