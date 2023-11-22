const mongoose = require('mongoose')


const database = async () => {
    const db = await mongoose.connect('mongodb://127.0.0.1:27017/broadway')
    console.log('Connected to mongoDB')
}


module.exports = database