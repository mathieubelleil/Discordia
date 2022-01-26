const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment, TextChannel } = require('discord.js');
const { token } = require('../config.json');
const {creation_perso} = require('../channels.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creation')
    .setDescription('create a character'),
  async execute(client, interaction) {
    const user = interaction.user.id
    const channel = await client.channels.cache.get(creation_perso);
    connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if (error) throw error;
          for(var i = 0; i < results.length;i++){
              if(results[i].enable == 1){
                  var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                  var emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");

                  const embed = new MessageEmbed()
                      .setColor(results[i].color)
                      .setDescription(`${emoji_femme}`+" "+`${emoji_homme}`+" - **"+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].capacite+"\n\n\n");
                  channel.send({ embeds: [embed] });

              }
          };
          channel.send("Choix de la race ?").then(async msg => {
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

                  // const filter = (user, interaction) => {
                  //   return true
                  //   // console.log(user)
                  //   // console.log(interaction.user.id)
                  //   // return user === interaction.user.id
                  // };

                  msg.react('👍').then(() => msg.react('👎'));

                  const filter = (reaction, user) => {
                  	return ['👍', '👎'].includes(reaction.emoji.name);
                  };

                  msg.awaitReactions({ filter, max: 1, time: 10000, errors: ['time'] })
                  	.then(collected => {
                      console.log('collected')
                  		const reaction = collected.first();
                  		if (reaction.emoji.name === '👍') {
                  			msg.reply('Destroy the orcs!');
                  		} else {
                  			msg.reply('You are something else');
                  		}
                  	})
                  	.catch(collected => {
                      console.log(collected)
                  		msg.reply('Please choose a race');
                  	});
              });

          });
      });
  }
}
