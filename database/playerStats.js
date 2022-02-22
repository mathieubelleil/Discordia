const {connection} = require('./db_connection')
const { token, guildId } = require('../config.json');

class Player {

  constructor(member) {
    this.member = member;
  }

  get member() {
    return this.member;
  }

  getStats() {
    connection.query('SELECT * FROM players WHERE discord_id = \' ' + this.member + '\'', function (error, results, fields) {
      if(error) throw error;
      console.log(results)
      const res = results
    })
    return res
  }
}




module.exports = {
  player: Player
}
