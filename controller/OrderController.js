const camelcaseKeys = require('camelcase-keys');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => {
    const connection = await conn.getConnection();
    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = camelcaseKeys(req.body);
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
    console.log('getOrders');
};

const getOrderDetail = async (req, res) => {
    console.log('getOrderDetail');
};

const deleteOrder = async (req, res) => {
    console.log('deleteOrder');
};

module.exports = {
    order,
    getOrders,
    getOrderDetail,
    deleteOrder,
};
