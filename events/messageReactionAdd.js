const {creation_perso} = require('../channels.json');

module.exports = {
	name: 'clickButton',
	on: true,
	async execute(client, reaction, user) {
        client.on('clickButton', async button => {
		    console.log(button.channelId);
		    button.reply("Cancelled");
		})
	},
};