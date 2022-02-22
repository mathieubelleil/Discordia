const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment, TextChannel, MessageButton, MessageActionRow } = require('discord.js');
const { token } = require('../configTST.json');
const { guildId } = require('../configTST.json')
const {creation_perso} = require('../channels.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creation')
    .setDescription('create a character'),
  async execute(client, interaction) {
    const user_id = interaction.user.id
    const guild = client.guilds.cache.get(guildId);
    const channel = await client.channels.cache.get(creation_perso);
    connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if (error) throw error;
          let embeds = new Array();
          let buttons = new Array();
          for(var i = 0; i < results.length;i++){
              if(results[i].enable == 1){
                  var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                  var emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");

                  const embed = new MessageEmbed()
                      .setColor(results[i].color)
                      .setDescription(`${emoji_femme}`+" "+`${emoji_homme}`+" - **"+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].capacite+"\n\n\n");
                  embeds.push(embed);
                  const buttonHomme = new MessageButton()
                  .setCustomId(results[i].nom+"_Homme")
                  .setLabel("")
                  .setStyle('PRIMARY')
                  .setEmoji(emoji_homme.id);
                  const buttonFemme = new MessageButton()
                  .setCustomId(results[i].nom+"_Femme")
                  .setLabel("")
                  .setStyle('PRIMARY')
                  .setEmoji(emoji_femme.id);
                  buttons.push(buttonHomme);
                  buttons.push(buttonFemme);
              }
          };
          const row = new MessageActionRow().addComponents(buttons);
          interaction.reply({ content: 'Bienvenue dans la création du personnage, dans un premier temps, faites un choix de race parmi cette liste.', ephemeral: true, embeds: embeds, components: [row] }).then(async msg => {
            client.on('interactionCreate', interactionButton => {
              if (interactionButton.isButton()){
                const buttonId = interactionButton.customId;
                var id = buttonId.split("_");
                connection.query('SELECT * FROM classes ORDER BY nom', function (error2, results2, fields2) {
                  if (error2) throw error2;
                      let embeds2 = new Array();
                      let buttons2 = new Array();
                      for(var i = 0; i < results2.length;i++){
                          if(results2[i].enable == 1){
                              var emoji = client.emojis.cache.find(emoji => emoji.name == results2[i].react);
            
                              const embed = new MessageEmbed()
                                  .setColor(results2[i].color)
                                  .setDescription(`${emoji}`+" - **"+results2[i].nom+"** ("+results2[i].pv+"PV - "+results2[i].dg+"DG) - "+results2[i].description+"\n\n"+results2[i].pouvoir+"\n\n\n");
                              embeds2.push(embed);
                              const button = new MessageButton()
                              .setCustomId(results2[i].nom)
                              .setLabel("")
                              .setStyle('PRIMARY')
                              .setEmoji(emoji.id);
                              buttons2.push(button);
                             
                          }
                      };
                      
                      const row2 = new MessageActionRow().addComponents(buttons2);
                      interaction.editReply({ content: 'Tu as choisi '+id[0]+' '+id[1]+' ! \nMaintenant choisi ta classe :', ephemeral: true, embeds: embeds2, components: [row2] }).then(async msg => {
                        client.on('interactionCreate', interactionButton => {
                          if (interactionButton.isButton()){
                            return;
                          }else{
                            return;
                          } 
                        });
                      });
                      
                  });

                  let member = guild.members.cache.get(user_id)
                  for(i in id){
                    
                    var role= guild.roles.cache.find(role => role.name === id[i]);
                    member.roles.add(role)
                  }
                
                  
                  

              }else{
                return;
              } 
            });
          });
      });
  }
}