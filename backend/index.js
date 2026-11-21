const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoDb = require('./config/mongodb');
const { mongo } = require('mongoose');
const { cloudinaryConnect } = require('./config/cloudinary');
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');

//app config
const PORT = process.env.PORT || 4000;
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter)

//External services connection
mongoDb.connectDb();
cloudinaryConnect();

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`)
})
