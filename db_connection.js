//Connection to the database
<<<<<<< HEAD
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = require('./config.json')[process.env.NODE_ENV || 'production'];
=======
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = require('./config.json')[process.env.NODE_ENV || 'production'];;
>>>>>>> update README + add development and production environment integration
const mysql = require('mysql');


const connection = mysql.createConnection({
  host     : DB_HOST,
  user     : DB_USER,
  password : DB_PASSWORD,
  database : DB_NAME
});

module.exports = {
  connection: connection
}
