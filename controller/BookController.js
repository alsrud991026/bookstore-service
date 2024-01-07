const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const { category_id, news } = req.query;
    let values = [];
    let sql = 'select * from books';

    if (category_id && news) {
        sql +=
            ' left join category on books.category_id = category.id where category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [category_id, news];
    } else if (category_id) {
        sql += ' left join category on books.category_id = category.id where category_id = ?';
        values = [category_id];
    } else if (news) {
        sql += ' where pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [news];
    }

    conn.query(sql, values, (err, results) => {
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
    const sql = 'select * from books left join category on books.category_id = category.id where books.id = ?';

    conn.query(sql, id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: '서버 에러',
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
