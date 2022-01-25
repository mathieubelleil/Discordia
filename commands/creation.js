const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creation')
    .setDescription('create a character'),
  async execute(interaction) {
    connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if (error) throw error;
          for(var i = 0; i < results.length;i++){
              if(results[i].enable == 1){
                  var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                  var emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");

                  const embed = new MessageEmbed()
                      .setColor(results[i].color)
                      .setDescription(`${emoji_femme}`+" "+`${emoji_homme}`+" - **"+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].capacite+"\n\n\n");
                  console.log(client.channels.cache.get("920652588381241364"))
                  client.channels.cache.get("920652588381241364").send({ embeds: [embed] });

              }
          };
          client.channels.cache.get("920652588381241364").send("Choix de la race ?").then(async msg => {
              connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
              if (error) throw error;
                  for(var i = 0; i < results.length;i++){
                      if(results[i].enable == 1){
                          var emojireact_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                          msg.react(emojireact_homme.id);
                          var emojireact_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");
                          msg.react(emojireact_femme.id);
                      }
                  };
              });
          });
      });
  }
}
