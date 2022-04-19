module.exports = {
	name: 'clickButton',
	on: true,
	async execute(client) {
		client.on('clickButton', async button => {
			console.log(button.channelId);
			button.reply('Cancelled');
		})
	},
};