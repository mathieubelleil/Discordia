module.exports = {
	name: 'messageReactionAdd',
	on: true,
	async execute(reaction,user) {
        if (!(reaction.message.author.id === user.id)){
		    console.log('@' + user.username + ' add reaction');
        }
	},
};