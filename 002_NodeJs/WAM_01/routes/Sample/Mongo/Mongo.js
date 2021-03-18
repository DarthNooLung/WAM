const express = require('express');
const router = express.Router();
const connect = require("./Connect");


router.get('/', (req, res) => {
    connect();
    res.send("");
});

module.exports = router;