const mongoose = require("mongoose");
const {Schema} = mongoose;
const dataSchema = new Schema({
    ActionId: {
        type: String,
        required: true
    },
    MyOrd: {
        type: Number,
        required: true
    },
    LastTime: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("WamRecentAction", dataSchema, "WamRecentAction");