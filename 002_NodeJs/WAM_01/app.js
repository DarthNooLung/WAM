const express = require('express');
const morgan = require('morgan');
const connect = require("./routes/DataAccess/Connect");
const dotenv = require("dotenv");
const path = require('path');
var cookieParser = require('cookie-parser');
dotenv.config();

//몽고디비 Connect 여기에서 해줌
connect();

const indexRouter = require('./routes');
const wamsRouter = require('./routes/wams');
const wamiRouter = require('./routes/wami');
const wamfRouter = require('./routes/wamf');
const wamMasterCreate = require('./routes/DataAccess/WamMasterCreate');

//테스트용입니다. 나중에 제거하세요.
const wamConRouter = require('./routes/Sample/WamCon');
const mongoRouter = require('./routes/Sample/Mongo/Mongo');
const mongoAddRouter = require('./routes/Sample/Mongo/MongoAdd');
const mongoSelectRouter = require('./routes/Sample/Mongo/MongoSelect');

const app = express();
app.use(cookieParser());
app.set('port', process.env.PORT);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(morgan('dev'));
//status 값을 304로 넘기기 때문에 처리하는 부분
app.disable('etag');

//Include 폴더 경로 잡기
app.use("/Include", express.static(path.join(__dirname, "/routes/Include")));
//테스트용입니다. 나중에 제거하세요.
app.use('/Mongo', mongoRouter);
app.use('/MongoAdd', mongoAddRouter);
app.use('/MongoSelect', mongoSelectRouter);
app.use('/wamcon', wamConRouter);

app.use('/WamMasterCreate', wamMasterCreate);

app.use('/wams', wamsRouter);
app.use('/wami', wamiRouter);
app.use('/wamf', wamfRouter);
app.use('/', indexRouter);


app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});