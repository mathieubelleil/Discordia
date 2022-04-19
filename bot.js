const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token, language } = require('./config.json')[process.env.NODE_ENV || 'production'];
const i18next = require('i18next');
const translationFR = require('./locales/fr.json')

i18next.init({
	lng: language,
	fallbackLng: 'fr',
	debug: true,
	resources: {
		fr : {
			translation: translationFR
		}
	}
}, (err) => {
	if (err) return console.error(err)
	console.log('i18next ready')
})

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({ intents: myIntents, partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER'] });

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
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
