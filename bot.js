require('dotenv').config();
const Discord = require('discord.js');
const Classes = require('./command/Class.js');
const Races = require('./command/Races.js');
var CONFIG = require('./other/config.json');
const Canvas = require('canvas');
const bot = new Discord.Client();
const prefix = "!";
const connection = require('./config.js')

bot.login(CONFIG.botKey);

bot.on('ready', function () {
  console.log("Je suis connecté !");
  Classes.parse(bot);
  Races.parse(bot);
})

bot.on('messageReactionAdd', (reaction, user) => {
  if(reaction.message.channel.id == "656118120540536853"){
    if(user != bot.user){
        connection.query('SELECT * FROM classes WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
            if (error) throw error;
              var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
              var role2 = reaction.message.guild.roles.cache.find(role => role.id === "676354733430145024");
              var role3 = reaction.message.guild.roles.cache.find(role => role.id === "676393968598122517");
              var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
              member.roles.add(role).catch(err = console.error);
              member.roles.add(role2).catch(err = console.error);
              member.roles.remove(role3).catch(err = console.error);
              connection.query('INSERT INTO players (discord_id,pv,dg,inv) VALUES ('+member.id+', "1", "1", "1")');
            });
    }
  }
  if(reaction.message.channel.id == "656118230359867392"){
    if(user != bot.user){
        connection.query('SELECT * FROM races WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
            if (error) throw error;
              var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
              var role2 = reaction.message.guild.roles.cache.find(role => role.id === "676393968598122517");
              var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
              member.roles.add(role).catch(err = console.error);
              member.roles.add(role2).catch(err = console.error);
              var roleToRemove = reaction.message.guild.roles.cache.find(role => role.id === "676354733430145024");
              member.roles.remove(roleToRemove).catch(err = console.error);
            });
    }
  }
})
bot.on('messageReactionRemove', (reaction, user) => {
  if(reaction.message.channel.id == "656118120540536853"){
    if(user != bot.user){
        connection.query('SELECT * FROM classes WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
            if (error) throw error;
                var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
                var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
                member.roles.remove(role).catch(err = console.error);
            });
    }
  }
  if(reaction.message.channel.id == "656118230359867392"){
    if(user != bot.user){
        connection.query('SELECT * FROM races WHERE react="'+reaction.emoji.name.replace("_Femme", "").replace("_Homme", "")+'"', function (error, results, fields) {
            if (error) throw error;
                var role = reaction.message.guild.roles.cache.find(role => role.id === results[0].roleid);
                var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
                member.roles.remove(role).catch(err = console.error);
            });
    }
  }
});

bot.on('message', async message => {
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  if(command === 'dice') {
    message.delete();
    if(args[0] != null){
      const nb = getRandomInteger(args[0], args[1]+1);
      var canvas = Canvas.createCanvas(50, 50);
      var ctx = canvas.getContext("2d");
      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0,0,50,50);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(nb, 25, 37.5);
    }else{
      const nb = getRandomInteger(1, 6+1);
      var canvas = Canvas.createCanvas(50, 50);
      var ctx = canvas.getContext("2d");
      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0,0,50,50);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(nb, 25, 37.5);
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'dice.png');
    return message.reply(attachment);
  }
  if(command === 'card') {
    message.delete();
    const canvas = Canvas.createCanvas(900, 1157);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./images/fond_carte.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Assign the decided font to the canvas
    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#ff0000';
    ctx.fillText(message.member.displayName, canvas.width / 2, canvas.height / 1.7);
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const logo = await Canvas.loadImage('./images/logo.png');
    ctx.drawImage(logo, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    message.channel.send(attachment);
	}
  if(command === 'fight') {
    message.delete();
    connection.query('SELECT * FROM monsters ORDER BY RAND() LIMIT 1', function (error, results, fields) {
      if (error) throw error;
        connection.query('SELECT on_combat FROM players WHERE discord_id="'+message.author.id+'"', function (error2, results2, fields2) {
          if (error2) throw error2;
            if(results2[0].on_combat != 1){
              var monster = results[0];
              message.channel.send('<@!'+message.author.id+'> Début de combat super pourri contre '+monster.nom+'.');
              connection.query('UPDATE players SET on_combat="1" WHERE discord_id="'+message.author.id+'"');
            }else{
              message.channel.send('<@!'+message.author.id+'> Impossible, vous êtes déjà en combat.');
            }
        });
    });
	}
  if(command === 'hit') {
    message.delete();
    connection.query('SELECT on_combat FROM players WHERE discord_id="'+message.author.id+'"', function (error, results, fields) {
      if (error) throw error;
        if(results[0].on_combat == 1){
          nb = getRandomInteger(0, 4);
          if(nb == 1){
            message.channel.send('<@!'+message.author.id+'> Bravo, l\'adversaire est mort.');
            connection.query('UPDATE players SET on_combat="0" WHERE discord_id="'+message.author.id+'"');
          }else{
            message.channel.send('<@!'+message.author.id+'> Raté, vous n\'avez pas touché l\'adversaire.');
          }
        }else{
          message.channel.send('<@!'+message.author.id+'> Impossible, vous n\'êtes pas en combat.');
        }
      });
	}
});
function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getIDFromRoleID(table, roleid) {
  connection.query('SELECT * FROM '+table+' WHERE roleid="'+roleid+'"', function (error, results, fields) {
      return results[0].id;
    });
}
