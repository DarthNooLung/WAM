const mongoose = require("mongoose");

const {Schema} = mongoose;
const dataSchema = new Schema({
    ActionId: {
        type: String,
        required: true,
        unique: true
    },
    TotCnt: {
        type: Number,
        required: true
    },
    NowOrd: {
        type: Number,
        required: true
    },
    AccCnt: {
        type: Number,
        required: true
    },
    DebugMode: {
        type: Boolean,
        required: true
    },
    UseYn: {
        type: Boolean,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

/*
몽구스는 model 메소드의 첫 번째 인수로 컬렉션 이름을 만듭니다.
첫번째 글자 소문자 + 맨뒤에 s 붙여서 생성
ex) User --> users 
컬렉션 명을 지정하고 싶을 경우 세번째 인수에 컬렉션 이름 부여하면 됨
*/
module.exports = mongoose.model("WamMaster", dataSchema, "WamMaster");