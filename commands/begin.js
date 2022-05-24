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
			const buttonContinue = new MessageButton()
				.setCustomId('Continue')
				.setLabel(i18next.t('begin.continue'))
				.setStyle('PRIMARY')
			const buttons = []
			buttons.push(buttonContinue)
			let step = 1
			const components = new MessageActionRow().addComponents(buttons);
			interaction.reply({ content: i18next.t('begin.start_1'), ephemeral: true, embeds: [], components: [components] }).then(async () => {
				await client.on('interactionCreate', async interactionButton => {
					await interactionButton.deferUpdate();
					if(interactionButton.isButton()) {
						const action = interactionButton.customId;
						if (action === 'Continue') {
							if (step < 5) {
								step++
								interaction.editReply({ content: i18next.t('begin.start_'+step), ephemeral: true, embeds: [], components: [components]})
							} else {

							}

						}
					}
				})
				//TODO : Gestion de la quête en BDD

				// await questHandler.questQuery(questId).then(results => {
				// 	console.log(results)
				// })
				// const quest = new questHandler(questId)
				// console.log(quest)
				// await quest.updateQuestProgress(user, 1)
				// console.log(quest.getName())
				// console.log(quest.getStepDesc(quest.step))
				//interaction.editReply({ content: i18next.t('begin.step'), ephemeral: true, embeds: [], components: [] })
			})
		})
	}
}