const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const { category_id, news, limit, current_page } = req.query;
    // limit : 페이지 당 도서 수
    // currentPage : 현재 페이지
    // offset : 페이지 당 도서 수 * (현재 페이지 - 1)

    const parsedLimit = parseInt(limit);
    const parsedCurrentPage = parseInt(current_page);

    if (!parsedLimit || !parsedCurrentPage || parsedLimit < 1 || parsedCurrentPage < 1) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'limit 혹은 currentPage가 잘못되었습니다.',
        });
    }

    const offset = parsedLimit * (parsedCurrentPage - 1);
    const values = [];

    let sql = 'select * from books';

    if (category_id && news) {
        sql +=
            ' left join category on books.category_id = category.id where category_id = ? and pub_date between date_sub(now(), interval 1 month) and now()';
        values.push(category_id);
    } else if (category_id) {
        sql += ' left join category on books.category_id = category.id where category_id = ?';
        values.push(category_id);
    } else if (news) {
        sql += ' where pub_date between date_sub(now(), interval 1 month) and now()';
        values.push(news);
    }

    sql += ' limit ?, ?';
    values.push(offset, parsedLimit);

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: '서버 에러',
            });
        }

        if (results.length === 0) {
            const message = category_id ? '해당하는 도서가 없습니다.' : '도서가 없습니다.';
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
