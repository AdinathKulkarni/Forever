const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoDb = require('./config/mongodb');
const { mongo } = require('mongoose');
const { cloudinaryConnect } = require('./config/cloudinary');
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoute');

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

//External services connection
mongoDb.connectDb();
cloudinaryConnect();

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`)
})
