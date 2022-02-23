const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment, TextChannel, MessageButton, MessageActionRow } = require('discord.js');
const { token, guildId } = require('../config.json');
const {creation_perso} = require('../channels.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creation')
    .setDescription('create a character'),
  async execute(client, interaction) {
    const user = interaction.user.id
    const guild = await client.guilds.cache.get(guildId);
    const channel = await client.channels.cache.get(creation_perso);
    let races;
    let classes;
    let gender;
    let pv = 0;
    let dg = 0;
    let identifiers = [];
    
    connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if (error) throw error;
          let embeds = new Array();
          let buttons = new Array();
          races = results;
          for(let i = 0; i < results.length;i++){
              if(results[i].enable == 1){
                  let emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                  let emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");

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
          interaction.reply({ content: 'Bienvenue dans la création du personnage, dans un premier temps, fais un choix de race parmi cette liste :', ephemeral: true, embeds: embeds, components: [row] }).then(async msg => {
            let step = 1;
            let member = guild.members.cache.get(user)
            await client.on('interactionCreate', interactionButton => {
              if (interactionButton.isButton()){
                const buttonId = interactionButton.customId;
                let id = buttonId.split("_");
                if (step === 1) {
                  connection.query('SELECT * FROM classes ORDER BY nom', function (error2, results2, fields2) {
                    if (error2) throw error2;
                    classes = results2;
                        let embeds2 = new Array();
                        let buttons2 = new Array();
                        for(let i = 0; i < results2.length;i++){
                            if(results2[i].enable == 1){
                                let emoji = client.emojis.cache.find(emoji => emoji.name == results2[i].react);

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
                        for(i in races){
                          
                          if(races[i].nom === id[0]){
                            pv += Number(races[i].pv)
                            dg += Number(races[i].dg)
                            identifiers.push(races[i].id)
                            
                          }
                        }
                        
                        
                      
                        for(i in id){
                          //add roles to user
                          var role= guild.roles.cache.find(role => role.name === id[i]);
                          member.roles.add(role)
                        }
                        
                        gender = id[1]
                        const row2 = new MessageActionRow().addComponents(buttons2);
                        interaction.editReply({ content: 'Tu as choisi '+id[0]+' '+id[1]+' ! \nMaintenant, choisis ta classe :', ephemeral: true, embeds: embeds2, components: [row2] })
                        
                    
                      });
                      step++;
                    } else if (step === 2) {
                      interaction.editReply({ content: 'Tu as choisi '+id[0]+' ! \nBravo le veau !', ephemeral: true, embeds: [], components: [] });
                      
                      let emoji = client.emojis.cache.find(emoji => emoji.name == 'check');
                      
                      let buttons3 = new Array();
                      const button = new MessageButton()
                            .setCustomId('validate')
                            .setLabel('')
                            .setStyle('PRIMARY')
                            .setEmoji(emoji.id);
                      buttons3.push(button)
                      const row3 = new MessageActionRow().addComponents(buttons3);
                      interaction.editReply({ content: 'Validez votre choix :', ephemeral: true, embeds: [], components: [row3] })
                      for(i in classes){
                          
                        if(classes[i].nom === id[0]){
                          pv+= Number(classes[i].pv)
                          dg += Number(classes[i].dg)
                          identifiers.push(classes[i].id)
                        }
                      }
                
                      
                      
                      for(i in id){
                        //add roles to user
                        let role= guild.roles.cache.find(role => role.name === id[i]);
                        member.roles.add(role)
                      }
                      
                      step++;
                      
                      
                    } else if (step === 3) {
                      //inserPlayerintodb
                      connection.query(`INSERT INTO players(discord_id,pv,pv_max,dg,gender,classes_id,races_id)
                                      VALUES(?,?,?,?,?,?,?)`,[user,pv,pv,dg,gender,identifiers[1],identifiers[0]]
                                    )
                      step++;
                    }
                
                  }else{
                    console.log('error, you should not see this great error message')
                      }
                        });
                      });
                      
                  });
  
  }
}
