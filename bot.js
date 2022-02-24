const fs = require('fs');
const { Client, Intents, Collection, MessageEmbed, MessageAttachment } = require('discord.js');
const { connection } = require('./db_connection.js');
const { token } = require('./config.json')[process.env.NODE_ENV || 'production'];

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({ intents: myIntents ,partials: ["CHANNEL", "MESSAGE", "REACTION", "USER"] });

client.login(token);


client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
