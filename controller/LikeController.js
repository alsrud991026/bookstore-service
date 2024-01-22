const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const sqlSelect = `select * from likes where user_id = ? and liked_book_id = ?`;

const checkExistValues = async (connection, values) => {
    const checkExist = `select (select count(*) from users where id = ?) as user_exists, (select count(*) from books where id = ?) as book_exists`;
    const [rows] = await connection.query(checkExist, values);

    return {
        userExists: rows[0].user_exists === 1,
        bookExists: rows[0].book_exists === 1,
    };
};

const addLike = async (req, res) => {
    const bookId = req.params.id;
    const userId = req.userId;
    const sqlInsert = `insert into likes (user_id, liked_book_id) values (?, ?)`;
    const values = [userId, bookId];

    const connection = await conn.getConnection();

    try {
        const { bookExists } = await checkExistValues(connection, values);

        if (!bookExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '존재하지 않는 도서입니다.',
            });
        }

        const [result] = await connection.query(sqlSelect, values);

        if (result.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '이미 좋아요한 책입니다.',
            });
        }

        const [insertResult] = await connection.query(sqlInsert, values);

        if (insertResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                message: '좋아요 성공',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '좋아요 실패',
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '서버 에러',
        });
    } finally {
        connection.release();
    }
};

const deleteLike = async (req, res) => {
    const bookId = req.params.id;
    const userId = req.userId;
    const sqlDelete = `delete from likes where user_id = ? and liked_book_id = ?`;
    const values = [userId, bookId];

    const connection = await conn.getConnection();

    try {
        const { userExists, bookExists } = await checkExistValues(connection, values);

        if (!userExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '존재하지 않는 유저입니다.',
            });
        }

        if (!bookExists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '존재하지 않는 도서입니다.',
            });
        }

        const [result] = await connection.query(sqlSelect, values);

        if (result.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '좋아요하지 않은 책입니다.',
            });
        }

        const [deleteResult] = await connection.query(sqlDelete, values);

        if (deleteResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                message: '좋아요 취소 성공',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '좋아요 취소 실패',
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '서버 에러',
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    addLike,
    deleteLike,
};
