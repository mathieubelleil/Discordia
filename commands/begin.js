const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const i18next = require('i18next');
const { guildId } = require('../config.json')[process.env.NODE_ENV || 'production'];
const {questHandler} = require('../helpers/questsHandler.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('begin')
		.setDescription('Lance l\'aventure'),
	async execute(client, interaction) {
		const questId = 1
		const user = interaction.user.id
		const guild = await client.guilds.cache.get(guildId)
		await connection.query('SELECT * FROM players WHERE discord_id = \'' + user + '\'', function(error, results) {
			if (error) throw error
			if(!results[0]) {
				return interaction.reply({ content: i18next.t('begin.error_no_character'), ephemeral: true, embeds: [], components: [] })
			}
			interaction.reply({ content: i18next.t('begin.start'), ephemeral: true, embeds: [], components: [] }).then(async () => {
				await questHandler.questQuery(questId).then(results => {
					console.log(results)
				})
				const quest = new questHandler(questId)
				console.log(quest)
				// await quest.updateQuestProgress(user, 1)
				// console.log(quest.getName())
				// console.log(quest.getStepDesc(quest.step))
				//interaction.editReply({ content: i18next.t('begin.step'), ephemeral: true, embeds: [], components: [] })
			})
		})
	}
}