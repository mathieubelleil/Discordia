const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('clear all messages'),
  async execute(client, interaction) {
    const Channel = interaction.channel;
    const Messages = Channel.messages.fetch();

    await Channel.bulkDelete(100, true);
  }
}
