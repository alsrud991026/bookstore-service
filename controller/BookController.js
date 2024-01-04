const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const sql = 'select * from books';

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }

        return res.status(StatusCodes.OK).json({
            books: results,
        });
    });
};

const bookDetail = (req, res) => {};

const booksByCategory = (req, res) => {};

module.exports = {
    allBooks,
    bookDetail,
    booksByCategory,
};
