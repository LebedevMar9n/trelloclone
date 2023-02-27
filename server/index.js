const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const { PORT, MONGO_URL } = require('./constants/config');

require('dotenv').config();

const { sectionRouter, taskRouter } = require('./routes');

mongoose.set('strictQuery', false);
mongoose.connect(
    process.env.MONGO_URL
    , () => console.log(`Connected to MongoDB `)).catch(err => {
    });
console.log(MONGO_URL);
const app = express();
const port = PORT;

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/section', sectionRouter);
app.use('/task', taskRouter);


app.use('*', (req, res) => {
    res.status(404).json('page not found');
});

app.use((err, req, res, next) => {
    // console.log(err);
    res
        .status(err.status || 500)
        .json({
            error: err.message || 'Unknown error'
        });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));