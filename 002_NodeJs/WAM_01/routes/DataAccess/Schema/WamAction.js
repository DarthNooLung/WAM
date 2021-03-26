const mongoose = require("mongoose");

const {Schema} = mongoose;
const dataSchema = new Schema({
    ActionId: {
        type: String,
        required: true
    },
    WamKey: {
        type: String,
        required: true
    },
    OrdNo: {
        type: Number,
        required: true
    },
    InDt: {
        type: Date,
        default: Date.now
    },
    OutDt: {
        type: Date
    }
});

module.exports = mongoose.model("WamAction", dataSchema, "WamAction");