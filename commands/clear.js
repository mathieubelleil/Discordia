const { SlashCommandBuilder } = require('@discordjs/builders');
const i18next = require('i18next');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprime les messages du channel'),
	async execute(client, interaction) {
		const Channel = interaction.channel;
		//const Messages = Channel.messages.fetch();
		//à quoi sert Messages ? 

		await Channel.bulkDelete(100, true);
	}
}
