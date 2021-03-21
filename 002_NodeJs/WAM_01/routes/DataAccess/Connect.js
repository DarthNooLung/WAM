const mongoose = require("mongoose");
const mCommon = require("../Module/Common");

const connect = () => {
    if(process.env.NODE_ENV !== "production") {
        mongoose.set("debug", true);
    }
    if(mongoose.connection.readyState == 0) {
        mongoose.connect(mCommon.AesDec(process.env.MONGO_CON), {
            dbName: "WAM",
            useNewUrlParser: true,
            useCreateIndex: true,
        }, (error) => {
            if(error) {
                console.log("몽고디비 연결 에러", error);
            }
            else {
                console.log("몽고디비 연결 성공");
            }
        });
    }
};

mongoose.connection.on("error", (error) => {
    console.error("몽고디비 연결 에러", error);
});
mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
});

module.exports = connect;