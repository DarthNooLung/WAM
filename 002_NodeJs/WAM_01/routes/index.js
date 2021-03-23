const express = require('express');
const router = express.Router();

var iCnt = 0;
router.get('/', (req, res) => {
    res.send("Hello World");
});

module.exports = router;