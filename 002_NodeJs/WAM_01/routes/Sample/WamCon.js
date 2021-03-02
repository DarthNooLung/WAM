const express = require('express');
const router = express.Router();
const fs = require('fs');
const pathStorage = __dirname;

router.get('/', (req, res) => {    
    var strUseFilePath = pathStorage + "\\WamCon.html";
    require("date-utils");
    var nowDate = new Date();
    var nowTime = nowDate.toFormat("YYYYMMDDHH24MISS");
    res.render(strUseFilePath, {NowTime: nowTime});
});
module.exports = router;