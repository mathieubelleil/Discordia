const {connection} = require('./db_connection')
const { token, guildId } = require('../config.json');

class Races {

  constructor() {};

  getRacesByName() {
    connection.query('SELECT * FROM races ORDER BY nom', function (error, results, fields) {
      if(error) throw error;
      console.log(results);
      return results
    })
  }


}




module.exports = {
  Races: Races
}
