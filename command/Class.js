const Discord = require('discord.js');
const Command = require('./command');
const {connection} = require('../config')

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
    }
}
