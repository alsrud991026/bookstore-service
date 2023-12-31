const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = async (req, res) => {
    const connection = await conn.getConnection();
    const { category_id, news, limit, current_page } = req.query;
    // limit : 페이지 당 도서 수
    // currentPage : 현재 페이지
    // offset : 페이지 당 도서 수 * (현재 페이지 - 1)

    const parsedLimit = parseInt(limit);
    const parsedCurrentPage = parseInt(current_page);
    const offset = parsedLimit * (parsedCurrentPage - 1);
    const values = [];

    let sql = 'select *, (select count(*) from likes where books.id=liked_book_id) as likes from books';

    if (category_id && news) {
        sql +=
            ' left join category on books.category_id = category.category_id where books.category_id = ? and pub_date between date_sub(now(), interval 1 month) and now()';
        values.push(category_id);
    } else if (category_id) {
        sql += ' left join category on books.category_id = category.category_id where books.category_id = ?';
        values.push(category_id);
    } else if (news) {
        sql += ' where pub_date between date_sub(now(), interval 1 month) and now()';
    }

    sql += ' limit ?, ?';
    values.push(offset, parsedLimit);

    try {
        const [rows] = await connection.query(sql, values);

        if (rows.length === 0) {
            const message = category_id ? '해당하는 도서가 없습니다.' : '도서가 없습니다.';
            return res.status(StatusCodes.NOT_FOUND).json({
                message: message,
            });
        }

        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '도서 조회 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const bookDetail = async (req, res) => {
    const connection = await conn.getConnection();
    const { user_id } = req.body;
    const book_id = req.params.id;
    const sql = `select *, (select count(*) from likes where books.id=liked_book_id) as likes,
        (select exists(select * from likes where liked_book_id=? and user_id=?)) as liked from books
        left join category on books.category_id = category.category_id where books.id=?`;
    const values = [book_id, user_id, book_id];
    try {
        const [rows] = await connection.query(sql, values);

        if (rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '해당하는 도서가 없습니다.',
            });
        }

        return res.status(StatusCodes.OK).json(rows[0]);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '도서 조회 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    allBooks,
    bookDetail,
};
