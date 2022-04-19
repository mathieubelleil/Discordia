const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const i18next = require('i18next');
const { guildId } = require('../config.json')[process.env.NODE_ENV || 'production'];

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
	return (dodge > dice)
}

function playerAttack(player, monster) {
	let content
	if (dodgeTest(monster.dodge)) {
		content = i18next.t('fight.enemy_dodge')
	} else if ((monster.attack + monster.damage) > player.armor) {
		const lostHP = (player.attack + player.damage) - monster.armor;
		monster.health -= lostHP;
		content = i18next.t('fight.player_hit', {lostHP: lostHP})
	} else {
		content = i18next.t('fight.player_weak_hit')
	}
	return content
}

function monsterSimpleAttack(monster, player) {
	let content
	if (dodgeTest(player.dodge)) {
		content = i18next.t('fight.player_dodge')
	} else if ((monster.attack + monster.damage) > player.armor) {
		const lostHP = (monster.attack + monster.damage) - player.armor;
		player.health -= lostHP;
		content = i18next.t('fight.enemy_hit', {lostHP: lostHP})
	} else {
		content = i18next.t('fight.enemy_weak_hit')
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
			interaction.reply({ content: i18next.t('fight.no_enemy'), ephemeral: true, embeds: [], components: [] });
		} else {
			let encounter = encounterRole.name.split('VS')
			encounter = encounter[1]
			connection.query('SELECT * FROM monsters WHERE name = \'' + encounter + '\'', function (error, results) {
				if (error) throw error;
				const monster = results[0]
				connection.query('SELECT * FROM players WHERE discord_id = \'' + member + '\'', (error, results) => {
					if (error) throw error;
					const player = results[0]
					//const embed = getEmbeds(player, monster)
					const emojiAttack = client.emojis.cache.find(emoji => emoji.name === 'attack')
					const buttonAttack = new MessageButton()
						.setCustomId('Attack')
						.setLabel(i18next.t('fight.actions.attack'))
						.setStyle('PRIMARY')
						.setEmoji(emojiAttack.id)
					const buttonFinish = new MessageButton()
						.setCustomId('Finish')
						.setLabel(i18next.t('fight.actions.finish'))
						.setStyle('PRIMARY')
						.setEmoji(emojiAttack.id)
					const buttons = []
					buttons.push(buttonAttack)
					let components = new MessageActionRow().addComponents(buttons);
					interaction.reply({ content: i18next.t('fight.encounter', {player: player.discord_id, enemy: monster.name}), ephemeral: true, embeds: getEmbeds(player, monster), components: [components] }).then(async () => {
						//const round = 1;
						let fightResult;
						let playerResult;
						let monsterResult;
						await client.on('interactionCreate', async interactionButton => {
							await interactionButton.deferUpdate();
							if(interactionButton.isButton()){
								const action = interactionButton.customId;
								if (action === 'Attack') {
									playerResult = playerAttack(player, monster);
								} else if (action === 'Finish') {
									console.log('TODO')
								} else {
									console.log('Normally impossible to see this console log');
									//TODO: Add other actions to do (drink potions, cast spells, shoot arrows...)
								}

								//Monster action :
								monsterResult = monsterSimpleAttack(monster, player);

								//Check if opponent or player is dead :
								if (player.health < 1) {
									fightResult = i18next.t('fight.result.death')
									components = new MessageActionRow().addComponents(buttonFinish)
								} else if (monster.health < 1) {
									fightResult = i18next.t('fight.result.victory')
									components = new MessageActionRow().addComponents(buttonFinish)
								} else {
									fightResult = i18next.t('fight.result.next')
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
