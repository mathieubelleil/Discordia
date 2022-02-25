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