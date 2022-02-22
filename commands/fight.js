const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../database/db_connection.js');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment, TextChannel, MessageButton, MessageActionRow } = require('discord.js');
const { token, guildId } = require('../config.json');
const {playerStats} = require('../database/playerStats')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('fight an encountered enemy'),
  async execute(client, interaction) {
    const guild = await client.guilds.cache.get(guildId);
    const member = guild.members.cache.get(interaction.user.id)
    const encounterRole = member.roles.cache.find(role => role.name.startsWith('VS'))
    if (!encounterRole) {
        interaction.reply({ content: 'Il n\'y a rien à combattre !', ephemeral: true, embeds: [], components: [] });;
    } else {
      let encounter = encounterRole.name.split('VS')
      encounter = encounter[1]
      connection.query('SELECT * FROM monsters WHERE nom = \'' + encounter + '\'', function (error, results, fields) {
        if (error) throw error;
      });
      interaction.reply({ content: 'Vous faites face à ' +encounter, ephemeral: true, embeds: [], components: [] });;
    }
  }
}
