const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../config/index');

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
        console.log(`Database connected to host: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

module.exports = dbConnect;


/*
const mongoose = require('mongoose');
const { MONGODB_CONNECTION_STRING, NODE_ENV } = require('../config/index');

const dbConnect = async () => {
  const env = NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set

  try {
    mongoose.set('strictQuery', false);

    if (env === 'production') {
      await mongoose.connect(MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Connected to Database: ${env}`);
    } else {
      await mongoose.connect('mongodb://127.0.0.1:27017/CoinBounce', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Connected to Database: ${env}`);
    }
  } catch (err) {
    console.error("Not Connected to Database ERROR!", err);
  }
};

module.exports = dbConnect;

*/