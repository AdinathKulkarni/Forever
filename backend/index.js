const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoDb = require('./config/mongodb');
const { mongo } = require('mongoose');
const { cloudinaryConnect } = require('./config/cloudinary');
const userRouter = require('./routes/userRoutes')

//app config
const PORT = process.env.PORT || 4000;
const app = express();

//middlewares
app.use(express.json());
app.use(cors());


//api endpoints
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        messgae: 'Api is working'
    })
});

mongoDb.connectDb();
cloudinaryConnect();
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`)
})