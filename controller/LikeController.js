const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const sqlSelect = `select * from likes where user_id = ? and liked_book_id = ?`;
const checkExist = `select (select count(*) from users where id = ?) as user_exists, (select count(*) from books where id = ?) as book_exists`;

const addLike = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;
    const sqlInsert = `insert into likes (user_id, liked_book_id) values (?, ?)`;
    const values = [user_id, id];

    conn.query(checkExist, values, (err, result) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: '서버 에러',
            });
        }

        if (result[0].user_exists === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '존재하지 않는 유저입니다.',
            });
        }

        if (result[0].book_exists === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '존재하지 않는 도서입니다.',
            });
        }

        conn.query(sqlSelect, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: '서버 에러',
                });
            }

            if (result.length > 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: '이미 좋아요한 책입니다.',
                });
            }

            conn.query(sqlInsert, values, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: '서버 에러',
                    });
                }

                return res.status(StatusCodes.OK).json({
                    message: '좋아요 성공',
                });
            });
        });
    });
};

const deleteLike = (req, res) => {};

module.exports = {
    addLike,
    deleteLike,
};
