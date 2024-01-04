const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const { category_id } = req.query;

    if (category_id) {
        const sql = 'select * from books where category_id = ?';

        conn.query(sql, category_id, (err, results) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: err.message,
                });
            }

            if (results.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: '해당하는 카테고리의 도서가 없습니다.',
                });
            }

            return res.status(StatusCodes.OK).json(results);
        });
    } else {
        const sql = 'select * from books';

        conn.query(sql, (err, results) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: err.message,
                });
            }

            if (results.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: '도서가 없습니다.',
                });
            }

            return res.status(StatusCodes.OK).json(results);
        });
    }
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

        return res.status(StatusCodes.OK).json(results[0]);
    });
};

module.exports = {
    allBooks,
    bookDetail,
};
