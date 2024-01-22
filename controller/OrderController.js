const camelcaseKeys = require('camelcase-keys');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => {
    const connection = await conn.getConnection();
    const userId = req.userId;
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = camelcaseKeys(req.body);
    const sqlInsertDelivery = `insert into delivery (address, receiver, contact) values (?, ?, ?)`;
    const valuesDelivery = [delivery.address, delivery.receiver, delivery.contact];
    const sqlInsertOrder = `insert into orders (book_title, total_quantity, total_price, user_id, delivery_id) values (?, ?, ?, ?, ?)`;
    const sqlInsertOrderedBook = `insert into orderedBook (order_id, book_id, quantity) values (?, ?, ?)`;

    try {
        const [rowsDelivery] = await connection.query(sqlInsertDelivery, valuesDelivery);
        const deliveryId = rowsDelivery.insertId;

        const valuesOrder = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
        const [rowsOrder] = await connection.query(sqlInsertOrder, valuesOrder);
        const orderId = rowsOrder.insertId;

        for (const item of items) {
            const valuesOrderItem = [orderId, item.book_id, item.quantity];
            await connection.query(sqlInsertOrderedBook, valuesOrderItem);
        }

        return res.status(StatusCodes.OK).json({
            message: '주문이 성공적으로 처리되었습니다.',
        });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '주문 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const getOrders = async (req, res) => {
    const connection = await conn.getConnection();
    const userId = req.userId;
    const sql = `select * from orders where user_id=?`;
    const value = [userId];

    try {
        const [rows] = await connection.query(sql, value);

        if (rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '주문 내역이 없습니다.',
            });
        }

        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '주문 내역 조회 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const getOrderDetail = async (req, res) => {
    const connection = await conn.getConnection();
    const userId = req.userId;
    const orderId = req.params.id;
    const sql = `select * from orders where id=? and user_id=?`;
    const values = [orderId, userId];

    try {
        const [rows] = await connection.query(sql, values);

        if (rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '주문 내역이 없습니다.',
            });
        }

        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '주문 내역 조회 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const deleteOrder = async (req, res) => {
    const connection = await conn.getConnection();
    const userId = req.userId;
    const orderId = req.params.id;
    const sqlSelectOrder = `select * from orders where id=?`;
    const sqlDeleteOrderedBook = `delete from orderedBook where order_id=?`;
    const sqlDeleteOrder = `delete from orders where id=?`;
    const sqlDeleteDelivery = `delete from delivery where id=?`;

    try {
        const [rowsOrder] = await connection.query(sqlSelectOrder, orderId);

        if (rowsOrder.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '주문 내역이 존재하지 않습니다.',
            });
        }

        if (rowsOrder[0].user_id !== userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '다른 사용자의 주문 내역을 삭제할 수 없습니다.',
            });
        }

        await connection.query(sqlDeleteOrderedBook, orderId);

        const deliveryId = rowsOrder[0].delivery_id;

        await connection.query(sqlDeleteOrder, orderId);
        await connection.query(sqlDeleteDelivery, deliveryId);

        return res.status(StatusCodes.OK).json({
            message: '주문이 성공적으로 삭제되었습니다.',
        });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '주문 삭제 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    order,
    getOrders,
    getOrderDetail,
    deleteOrder,
};
