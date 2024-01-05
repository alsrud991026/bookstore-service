const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const { category_id } = req.query;
    let sql = 'select * from books';

    if (category_id) {
        sql += ' where category_id = ?';
    }

    conn.query(sql, category_id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: '서버 에러',
            });
        }

        if (results.length === 0) {
            const message = category_id ? '해당하는 카테고리의 도서가 없습니다.' : '도서가 없습니다.';
            return res.status(StatusCodes.NOT_FOUND).json({
                message: message,
            });
        }

        return res.status(StatusCodes.OK).json(results);
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

        return res.status(StatusCodes.OK).json(results[0]);
    });
};

module.exports = {
    allBooks,
    bookDetail,
};
