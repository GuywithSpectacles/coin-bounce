const express = require('express');
const dbConnect = require ('./database/index');
const {PORT} = require('./config/index');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // to communicate backend with frontend

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true // coz we are using cookies
}

const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

app.use(router);

dbConnect();

app.use('/storage', express.static('storage'));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`BACKEND is live at ${PORT}`)
});