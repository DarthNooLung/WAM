const express = require('express');
const router = express.Router();
const WamMaster = require("./Schema/WamMaster");
var mStatus = require("../Module/Status");
var mDWM = require("./Execute/DaWamMaster");

router.get('/', async (req, res) => {
    //var isChk = await mDa.ActionIdUseCheck("1");
    WamMaster.create({
        ActionId: "1",
        TotCnt: 0,
        NowOrd: 0,
        AccCnt: 1,
        DebugMode: false,
        UseYn: true
    });
    res.send("계정생성완료");
});

module.exports = router;