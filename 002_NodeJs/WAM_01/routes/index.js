const express = require('express');
const router = express.Router();
var vTotCnt = require("./Module/var");

var iCnt = 0;
router.get('/', (req, res) => {
    vTotCnt.SetTotCnt();
    //res.send("ID : " + req.params.id + "<br/>Key : " + req.query.key + "<br/>Number : " + String(vTotCnt.GetTotCnt()));
});

module.exports = router;