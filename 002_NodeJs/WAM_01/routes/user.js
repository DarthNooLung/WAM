const express = require('express');
const router = express.Router();

var vTotCnt = require("./Module/var");

router.get('/', (req, res) => {
    res.send("Hello, User<br/>Number : " + String(vTotCnt.GetTotCnt()));
});

module.exports = router;