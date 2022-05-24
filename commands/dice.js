const { SlashCommandBuilder } = require('@discordjs/builders');
const Canvas = require('canvas');
const {MessageAttachment} = require('discord.js')
const i18next = require('i18next');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Lance un dé à 6 faces'),
	async execute(client, interaction) {
		const nb = getRandomInteger(1, 6+1);
		const canvas = Canvas.createCanvas(50, 50);
		const ctx = canvas.getContext('2d');
		ctx.font = '30px Comic Sans MS';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0,0,50,50);
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.fillText(nb, 25, 37.5);
		const attachment = new MessageAttachment(canvas.toBuffer(), 'dice.png');
		return interaction.reply({ files: [attachment] });
	}
};

function getRandomInteger(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// function getIDFromRoleID(table, roleid) {
// 	connection.query('SELECT * FROM '+table+' WHERE roleid="'+roleid+'"', function (error, results, fields) {
// 		return results[0].id;
// 	});
// }
