const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

const getConnection = async () => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        return connection;
    } catch (err) {
        return err;
    }
};

module.exports = {
    getConnection,
};
