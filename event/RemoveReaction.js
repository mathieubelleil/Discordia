bot.on('messageReactionAdd', (reaction, user) => {
    // on vérifie que ce soit bien la bonne réaction et on ne compte pas celui du bot
    if(user != bot.user){
        connection.query('SELECT * FROM classes WHERE react="'+reaction.emoji.name+'"', function (error, results, fields) {
            if (error) throw error;
                var role = reaction.message.guild.roles.cache.find(role => role.name === results[0].nom)
                var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
                member.roles.add(role.id).catch(err = console.error);
            });
    }
})
bot.on('messageReactionRemove', (reaction, user) => {
    // on vérifie que ce soit bien la bonne réaction et on ne compte pas celui du bot
    if(user != bot.user){
        connection.query('SELECT * FROM classes WHERE react="'+reaction.emoji.name+'"', function (error, results, fields) {
            if (error) throw error;
                var role = reaction.message.guild.roles.cache.find(role => role.name === results[0].nom)
                var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
                member.roles.remove(role.id).catch(err = console.error);
            });
    }
})