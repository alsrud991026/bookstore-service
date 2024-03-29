const camelcaseKeys = require('camelcase-keys');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const checkExist = `select (select count(*) from users where id = ?) as user_exists, (select count(*) from books where id = ?) as book_exists`;

const checkExistValues = async (connection, values) => {
    const [rows] = await connection.query(checkExist, values);
    return {
        user_exists: rows[0].user_exists === 1,
        book_exists: rows[0].book_exists === 1,
    };
};

const addToCart = async (req, res) => {
    const connection = await conn.getConnection();
    const { bookId, quantity } = camelcaseKeys(req.body);
    const userId = req.userId;

    const sqlInsertCart = 'insert into cartItems (book_id, quantity, user_id) values (?, ?, ?)';
    const sqlSelectCart = 'select * from cartItems where user_id = ? and book_id = ?';
    const sqlUpdateCart = 'update cartItems set quantity = quantity + ? where user_id = ? and book_id = ?';
    const values = [bookId, quantity, userId];
    const existValues = [userId, bookId];

    try {
        const { book_exists } = await checkExistValues(connection, existValues);

        if (!book_exists) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '존재하지 않는 도서입니다.',
            });
        }

        const [rowsSelect] = await connection.query(sqlSelectCart, existValues);

        if (rowsSelect.length > 0) {
            const [rowsUpdate] = await connection.query(sqlUpdateCart, [quantity, userId, bookId]);

            if (rowsUpdate.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({
                    message:
                        '이미 장바구니에 담긴 도서입니다. 원하시는 수량만큼 장바구니에 담긴 도서의 수량이 증가하였습니다.',
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: '장바구니 추가에 실패하였습니다.',
                });
            }
        }

        const [rowsInsert] = await connection.query(sqlInsertCart, values);

        if (rowsInsert.affectedRows > 0) {
            return res.status(StatusCodes.CREATED).json({
                message: '장바구니에 도서가 추가되었습니다.',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '장바구니 추가에 실패하였습니다.',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '장바구니 추가 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const getCartItems = async (req, res) => {
    const connection = await conn.getConnection();
    const userId = req.userId;
    const { selected } = camelcaseKeys(req.body);

    const sqlSelectAllCart = `select cartItems.id, book_id, title, summary, quantity, price
    from cartItems left join books on cartItems.book_id = books.id where user_id = ?`;
    const sqlSelectSelectedCart = `select cartItems.id, book_id, title, summary, quantity, price
    from cartItems left join books on cartItems.book_id = books.id where user_id = ? and cartItems.id in (?)`;

    let sqlSelectCart;
    let values;

    if (selected) {
        sqlSelectCart = sqlSelectSelectedCart;
        values = [userId, selected];
    } else {
        sqlSelectCart = sqlSelectAllCart;
        values = [userId];
    }

    try {
        const [rowsSelect] = await connection.query(sqlSelectCart, values);

        if (rowsSelect.length > 0) {
            return res.status(StatusCodes.OK).json(rowsSelect);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '장바구니에 담긴 도서가 없습니다.',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '장바구니 조회 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const deleteCartItem = async (req, res) => {
    const connection = await conn.getConnection();
    const bookId = req.params.id;
    const userId = req.userId;
    const values = [bookId, userId];

    const sqlDeleteCart = 'delete from cartItems where id = ? and user_id = ?';

    try {
        const [rowsDelete] = await connection.query(sqlDeleteCart, values);

        if (rowsDelete.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                message: '장바구니 도서가 삭제되었습니다.',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '장바구니 도서를 삭제할 수 없습니다.',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '장바구니 도서 삭제 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem,
};
