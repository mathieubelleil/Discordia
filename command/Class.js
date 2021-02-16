const Discord = require('discord.js');
const Command = require('./command');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'mysql-jimg.alwaysdata.net',
  user     : 'jimg_jdr',
  password : 'Jdr123456,',
  database : 'jimg_jdr'
});

module.exports = class Class extends Command {
    static match (client){
        const channel = client.channels.cache.get('656118120540536853');
        channel.messages.fetch()
               .then(function(list){
                channel.bulkDelete(list);
                }, function(err){channel.send("ERROR: ERROR CLEARING CHANNEL.")})
        connection.query('SELECT * FROM classes ORDER BY nom', function (error, results, fields) {
        if (error) throw error;
            for(var i = 0; i < results.length;i++){
                if(results[i].enable == 1){
                    var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                    var emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");
                    
                    const embed = new Discord.MessageEmbed()
                        .setColor(results[i].color)
                        .setDescription(emoji_homme+" "+emoji_femme+" - **"+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].pouvoir+"\n\n\n");
                    channel.send({embed});
                    
                }
            };
            channel.send("Choix de la classe ?").then(async msg => {
                connection.query('SELECT * FROM classes ORDER BY nom', function (error, results, fields) {
                if (error) throw error;
                    for(var i = 0; i < results.length;i++){
                        if(results[i].enable == 1){
<<<<<<< HEAD
=======
                            console.log(results[i].react);
>>>>>>> addc6c1 (fix)
                            var emojireact_homme = client.emojis.cache.find(emoji => emoji.name === results[i].react+"");
                            //msg.react(emojireact_homme.id);
                            console.log(emojireact_homme);
                            msg.react(emojireact_homme.id);
                        }
                    };
                });
            });
        });
    }
}