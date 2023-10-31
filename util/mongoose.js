const mongoose = require('mongoose'); 
require('dotenv').config();

const connectToMongoDB = async ()=>{
    return await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
}

module.exports = {
    connectToMongoDB
};
































































