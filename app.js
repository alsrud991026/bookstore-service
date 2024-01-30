const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { swaggerUi, specs } = require('./swagger/swagger');

dotenv.config();

app.listen(process.env.PORT);

const authRouter = require('./routes/auth');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/category', categoryRouter);
app.use('/likes', likeRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
