require('dotenv').config();
const { Client, Intents, MessageEmbed, MessageAttachment } = require('discord.js');
const { connection } = require('./config.js');
const { token } = require('./config.json');
const Canvas = require('canvas');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'creation') {
    connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if (error) throw error;
          for(var i = 0; i < results.length;i++){
              if(results[i].enable == 1){
                  var emoji_homme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Homme");
                  var emoji_femme = client.emojis.cache.find(emoji => emoji.name == results[i].react+"_Femme");

                  const embed = new MessageEmbed()
                      .setColor(results[i].color)
                      .setDescription(`${emoji_femme}`+" "+`${emoji_homme}`+" - **"+results[i].nom+"** ("+results[i].pv+"PV - "+results[i].dg+"DG) - "+results[i].description+"\n\n"+results[i].capacite+"\n\n\n");
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

  if (commandName === 'dice') {
      const nb = getRandomInteger(1, 6+1);
      var canvas = Canvas.createCanvas(50, 50);
      var ctx = canvas.getContext("2d");
      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0,0,50,50);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(nb, 25, 37.5);
      const attachment = new MessageAttachment(canvas.toBuffer(), 'dice.png');
      return interaction.reply({ files: [attachment] });
  }
});

client.login(token);

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}