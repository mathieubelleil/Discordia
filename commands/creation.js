const { SlashCommandBuilder } = require('@discordjs/builders');
const { connection } = require('../db_connection.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { guildId } = require('../config.json')[process.env.NODE_ENV || 'production'];
const i18next = require('i18next')

function setUsername(member) {
	if (member.nickname){
		return member.nickname
	} else {
		return member.user.username
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('creation')
		.setDescription('Création personnage'),
	async execute(client, interaction) {
		const user = interaction.user.id
		const guild = await client.guilds.cache.get(guildId);
		let username;
		let races;
		let classes;
		let gender;
		let health = 0;
		let damage = 0;
		let attack = 0;
		let dodge = 0;
		let armor = 0;
		let chosenRaceId;
		let chosenRaceName;
		let chosenClassId;
		let chosenClassName;
		connection.query('SELECT * FROM players WHERE discord_id = \'' + user + '\'', function(error, results) {
			if (error) throw error;
			if(results[0]) {
				interaction.reply({ content: i18next.t('creation.error_character_created'), ephemeral: true, embeds: [], components: [] })
			} else {
				connection.query('SELECT * FROM races ORDER BY name', function (error, results) {
					if (error) throw error;
					const embeds = [];
					const buttons = [];
					races = results;
					for(let i = 0; i < results.length;i++){
						if(results[i].enable === 1){
							const emoji_homme = client.emojis.cache.find(emoji => emoji.name === results[i].react+'_Homme');
							const emoji_femme = client.emojis.cache.find(emoji => emoji.name === results[i].react+'_Femme');

							const embed = new MessageEmbed()
								.setColor(results[i].color)
								.setDescription(`${emoji_femme}`+' '+`${emoji_homme}`+' - **'+results[i].name+'** ('+results[i].health+'PV - '+results[i].damage+' dégâts) - '+results[i].description+ '\n\n *'
                         + results[i].ability1_name+'* : '+results[i].ability1_desc +'\n *' + results[i].ability2_name+ '* : ' + results[i].ability2_desc +'\n\n\n');
							embeds.push(embed);
							const buttonHomme = new MessageButton()
								.setCustomId(results[i].name+'_Homme')
								.setLabel('')
								.setStyle('PRIMARY')
								.setEmoji(emoji_homme.id);
							const buttonFemme = new MessageButton()
								.setCustomId(results[i].name+'_Femme')
								.setLabel('')
								.setStyle('PRIMARY')
								.setEmoji(emoji_femme.id);
							buttons.push(buttonHomme);
							buttons.push(buttonFemme);
						}
					}
					const row = new MessageActionRow().addComponents(buttons);
					interaction.reply({ content: i18next.t('creation.welcome'), ephemeral: true, embeds: embeds, components: [row] }).then(async () => {
						let step = 1;
						const member = guild.members.cache.get(user)
						await client.on('interactionCreate', async interactionButton => {
							await interactionButton.deferUpdate();
							if (interactionButton.isButton()){
								const buttonId = interactionButton.customId;
								const id = buttonId.split('_');
								if (step === 1) {
									connection.query('SELECT * FROM classes ORDER BY name', function (error2, results2) {
										if (error2) throw error2;
										classes = results2;
										const embeds2 = [];
										const buttons2 = [];
										for(let i = 0; i < results2.length;i++){
											if(results2[i].enable === 1){
												const emoji = client.emojis.cache.find(emoji => emoji.name === results2[i].react);

												const embed = new MessageEmbed()
													.setColor(results2[i].color)
													.setDescription(`${emoji}`+' - **'+results2[i].name+'** ('+results2[i].health+i18next.t('character.health')+results2[i].damage+i18next.t('character.damage')+') - '+results2[i].description+'\n\n *'+ results2[i].ability1_name+'* : '+results2[i].ability1_desc +'\n *' + results2[i].ability2_name+ '* : ' + results2[i].ability2_desc +'\n\n\n');
												embeds2.push(embed);
												const button = new MessageButton()
													.setCustomId(results2[i].name)
													.setLabel('')
													.setStyle('PRIMARY')
													.setEmoji(emoji.id);

												buttons2.push(button);
											}
										}
										for(const i in races){

											if(races[i].name === id[0]){
												health += Number(races[i].health)
												attack += Number(races[i].attack)
												damage += Number(races[i].damage)
												dodge += Number(races[i].dodge)
												armor += Number(races[i].armor)
												chosenRaceName = races[i].name
												chosenRaceId = races[i].id

											}
										}

										for(const i in id){
											//add roles to user
											const role= guild.roles.cache.find(role => role.name === id[i]);
											member.roles.add(role)
										}

										gender = id[1]
										const row2 = new MessageActionRow().addComponents(buttons2);
										interaction.editReply({ content: i18next.t('creation.race_choice', {chosenRaceName: chosenRaceName, gender: gender}), ephemeral: true, embeds: embeds2, components: [row2] })

									});
									step++;
								} else if (step === 2) {
									const emoji = client.emojis.cache.find(emoji => emoji.name === 'check');

									const buttons3 = [];
									const button = new MessageButton()
										.setCustomId('validate')
										.setLabel('Valider')
										.setStyle('PRIMARY')
										.setEmoji(emoji.id);
									buttons3.push(button)
									const row3 = new MessageActionRow().addComponents(buttons3);

									for(const i in classes){

										if(classes[i].name === id[0]){
											health += Number(classes[i].health)
											attack += Number(classes[i].attack)
											damage += Number(classes[i].damage)
											dodge += Number(classes[i].dodge)
											chosenClassName = classes[i].name
											chosenClassId = classes[i].id
										}
									}

									username = setUsername(member);

									interaction.editReply({ content: i18next.t('creation.class_choice', {chosenClassName: chosenClassName, username: username}), ephemeral: true, embeds: [], components: [row3] })

									for(const i in id){
										//add roles to user
										const role= guild.roles.cache.find(role => role.name === id[i]);
										member.roles.add(role)
									}

									step++;


								} else if (step === 3) {
									username = setUsername(member);

									connection.query(`INSERT INTO players(name, discord_id,health,maxHealth,damage,attack,dodge,armor,gender,classes_id,races_id)
                                        VALUES(?,?,?,?,?,?,?,?,?,?,?)`,[username,user,health,health,damage,attack,dodge,armor,gender,chosenClassId,chosenRaceId]
									)
									interaction.editReply({ content: i18next.t('creation.register', {username: username}), ephemeral: true, embeds: [], components: []})
								}
							}
						});
					});
				});
			}
		});
	}
}
