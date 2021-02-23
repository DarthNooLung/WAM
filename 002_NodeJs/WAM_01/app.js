const express = require('express');
const morgan = require('morgan');
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const wamRouter = require('./routes/wam');

const app = express();

app.set('port', process.env.PORT);
app.use(morgan('dev'));

//status 값을 304로 넘기기 때문에 처리하는 부분
//https://ko.ojit.com/so/node.js/50362
//https://huns.me/development/2306
app.disable('etag');

app.use('/wam', wamRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);


app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});