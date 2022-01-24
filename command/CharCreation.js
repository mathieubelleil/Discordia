const Discord = require('discord.js');
const Command = require('./command')
const Classes = require('./Class.js');
const Races = require('./Races.js');
const Canvas = require('canvas');
const {connection, charCreationChannel, bot} = require('../config.js')

module.exports = class CharCreation extends Command {
  static match(client){

      const channel = client.channels.cache.get(charCreationChannel);
      channel.messages.fetch()
             .then(function(list){
              channel.bulkDelete(list);
            }, function(err){channel.send("ERROR: ERROR CLEARING CHANNEL.")})
// DISPLAY RACES TO CHOOSE
      connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if (error) throw error;
          for(var i = 0; i < results.length;i++){
              if(results[i].enable == 1){
                  var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                  var emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");

                  const embed = new Discord.MessageEmbed()
                      .setColor(results[i].color)
                      .setDescription(`${emoji_femme}`+" "+`${emoji_homme}`+" - **"+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].capacite+"\n\n\n");
                  channel.send({embed});

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
              });
          });
      })

// PLAYER CHOOSE A RACE
      bot.on('messageReactionAdd', (reaction, user1) => {
        if(user === user1 && member.roles.cache.find(role => role.id === "676393968598122517")){
            connection.query('SELECT * FROM races WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
                if (error) throw error;
                  var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);

                  var role3 = reaction.message.guild.roles.cache.find(role => role.id === "676354733430145024");

                  member.roles.add(role).catch(error = console.error);
                  member.roles.add(role3).catch(error = console.error);
                  var roleToRemove = reaction.message.guild.roles.cache.find(role => role.id === "676393968598122517");
                  member.roles.remove(roleToRemove).catch(error = console.error);


                  // DISPLAY CLASSES TO CHOOSE FROM
                  channel.messages.fetch()
                         .then(function(list){
                          channel.bulkDelete(list);
                          }, function(err){channel.send("ERROR: ERROR CLEARING CHANNEL.")})
                  connection.query('SELECT * FROM classes ORDER BY nom', function (error, results, fields) {
                  if (error) throw error;
                      for(var i = 0; i < results.length;i++){
                          if(results[i].enable == 1){
                              var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react);

                              const embed = new Discord.MessageEmbed()
                                  .setColor(results[i].color)
                                  .setDescription(`${emoji_homme}`+' **'+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].pouvoir+"\n\n\n");
                              channel.send({embed});

                          }
                      };
                      channel.send("Choix de la classe ?").then(async msg => {
                          connection.query('SELECT * FROM classes ORDER BY nom', function (error, results, fields) {
                          if (error) throw error;
                              for(var i = 0; i < results.length;i++){
                                  if(results[i].enable == 1){
                                      var emojireact_homme = client.emojis.cache.find(emoji => emoji.name === results[i].react+"");
                                      msg.react(emojireact_homme.id);
                                  }
                              };
                          });
                      });
                  });
                });
        //PLAYER CHOOSE A CLASS
        } if(user === user1 ){
            connection.query('SELECT * FROM classes WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
                if (error) throw error;
                  var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
                  var role3 = reaction.message.guild.roles.cache.find(role => role.id === "676393968598122517");
                  var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
                  member.roles.add(role).catch(error = console.error);
                  member.roles.add(role2).catch(error = console.error);
                  member.roles.remove(role3).catch(error = console.error);
                  connection.query('INSERT INTO players (discord_id,pv,dg,inv) VALUES ('+member.id+', "1", "1", "1")');
                });
        }
      });





  }
}





// TO DO : on remove emoji :
// bot.on('messageReactionRemove', (reaction, user) => {
//   if(reaction.message.channel.id == charCreationChannel){
//     if(user != bot.user){
//         connection.query('SELECT * FROM classes WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
//             if (error) throw error;
//                 var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
//                 var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
//                 member.roles.remove(role).catch(err = console.error);
//             });
//     }
//   }
//   if(reaction.message.channel.id == charCreationChannel){
//     if(user != bot.user){
//         connection.query('SELECT * FROM races WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
//             if (error) throw error;
//                 var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
//                 var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
//                 member.roles.remove(role).catch(err = console.error);
//             });
//     }
//   }
//});
