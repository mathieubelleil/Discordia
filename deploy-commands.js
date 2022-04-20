const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const i18next = require('i18next');
const translationFR = require('./locales/fr.json');
const { clientId, guildId, token, language } = require('./config.json')[process.env.NODE_ENV || 'production'];

i18next.init({
	lng: language,
	fallbackLng: 'fr',
	debug: true,
	resources: {
		fr: {
			translation: translationFR
		}
	}
}, (err) => {
	if (err) return console.error(err)
	console.log('i18next ready')
}).then(() => {
	const commands = [];
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
		console.log(command)
	}

	const rest = new REST({version: '9'}).setToken(token);

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{body: commands},
			);

			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	})();
})
