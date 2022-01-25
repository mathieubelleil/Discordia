const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('clear all messages'),
  async execute(client, interaction) {
    interaction.channel.bulkDelete(99)
    .catch(console.error);
  }
}
