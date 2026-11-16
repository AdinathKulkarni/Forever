const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDb = async() => {
    try{
        const DB_URL = process.env.DB_URL;
        await mongoose.connect(DB_URL, { dbName: 'forever' })
        console.log('DB Connection successful✅')
    } catch(e){
        return console.log('Error while connecting to DB', e.message)
    }
}