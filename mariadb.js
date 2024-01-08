// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

module.exports = connection;
