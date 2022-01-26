module.exports = {
	name: 'messageReactionRemove',
	on: true,
	async execute(reaction,user) {
        if (!(reaction.message.author.id === user.id)){
		    console.log('@' + user.username + ' remove reaction');
        }
	},
};