const Discord = require('discord.js');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

const { Client, Intents } = require('discord.js');
    
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });


const charCreationChannel = "920652588381241364"

const bot = new Discord.Client();

const charCreationChannel = "920652588381241364"

module.exports = {
  connection: connection,
  bot: bot,
  charCreationChannel : charCreationChannel
}
