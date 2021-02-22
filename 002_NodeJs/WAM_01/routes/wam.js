const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send("ID : " + req.params.id + "<br/>Key : " + req.query.key + "<br/>Number : " + String(vTotCnt.GetTotCnt()));
    res.send("asdfasdf");
});

module.exports = router;