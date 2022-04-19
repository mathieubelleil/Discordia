const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const i18next = require('i18next');
const { guildId } = require('../config.json')[process.env.NODE_ENV || 'production'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('begin')
		.setDescription('fez'),
	async execute(client, interaction) {
		const user = interaction.user.id
		const guild = await client.guilds.cache.get(guildId)
		await connection.query('SELECT * FROM players WHERE discord_id = \'' + user + '\'', function(error, results, fields) {
			if (error) throw error
			if(!results[0]) {
				interaction.reply({ content: i18next.t('begin.error_no_character'), ephemeral: true, embeds: [], components: [] })
			} else {
				interaction.reply({ content: 'Begin', ephemeral: true, embeds: [], components: [] })
			}
		})
	}
}