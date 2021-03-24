const mongoose = require("mongoose");

const {Schema} = mongoose;
const dataSchema = new Schema({
    ActionId: {
        type: String,
        required: true,
        unique: true
    },
    WamKey: {
        type: String,
        required: true,
        unique: true
    },
    OrdNo: {
        type: Number,
        required: true
    },
    InputDt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("WamAction", dataSchema, "WamAction");