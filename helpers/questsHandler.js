const { connection } = require('../db_connection')

class questHandler {

	constructor(id, name, steps) {
		this.id = id
		this.name = name
		this.steps = steps
		this.step = 1
	}

	static async questQuery(id) {
		await connection.query('SELECT * FROM quests WHERE id = \'' + id + '\'', function(error, results) {
			if (error) throw error
			return results
		})
	}

	getName() {
		return this.name
	}

	getStepDesc(step) {
		for (const key in Object.keys(this.steps)) {
			if (key === step) {
				return this.steps[key]
			}
		}
	}

	async updateQuestProgress(player, step) {
		await connection.query('UPDATE players SET activeQuests = \'' + step + '\' WHERE discord_id = \'' + player + '\'', function (error) {
			if (error) throw error
			this.step = step
		})
	}

}

module.exports = {questHandler}