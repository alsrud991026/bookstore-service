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

const bookDetail = (req, res) => {
    const { id } = req.params;
    const sql = 'select * from books where id = ?';

    conn.query(sql, id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '해당하는 도서가 없습니다.',
            });
        }

        return res.status(StatusCodes.OK).json({
            book: results[0],
        });
    });
};

const booksByCategory = (req, res) => {};

module.exports = {
    allBooks,
    bookDetail,
    booksByCategory,
};
