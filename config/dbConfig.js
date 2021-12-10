const mongoose = require('mongoose');

const connectDB = () => {
    try {
        mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true  
        });
        console.log('database connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;