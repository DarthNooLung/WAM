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
    Year: {
        type: Number,
        required: true
    },
    Month: {
        type: Number,
        required: true
    },
    Day: {
        type: Number,
        required: true
    },
    Hour: {
        type: Number,
        required: true
    },
    Minute: {
        type: Number,
        required: true
    }    
});

module.exports = mongoose.model("WamRecentAction", dataSchema, "WamRecentAction");