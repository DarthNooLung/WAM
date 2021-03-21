const express = require('express');
const router = express.Router();
const WamMaster = require("./Schema/WamMaster");
var mStatus = require("../Module/Status");
var mDa = require("../Module/DataAccess");

router.get('/', (req, res) => {
    //var isChk = mStatus.GetStatus("1");
    var isChk = mDa.ActionIdUseCheck("1");
    console.log(isChk);
    /*
    WamMaster.create({
        ActionId: "1",
        TotCnt: 0,
        NowOrd: 0,
        AccCnt: 0,
        DebugMode: false,
        UseYn: true
    });
    */
   /*
   WamMaster.find({ActionId: "1", UseYn: true})
    .then(Data => {
        if(Data.length == 1) {
            console.log("1");
        }
        else {
            console.log("2");
        }
    })
    .catch(err => {
        console.log("3");
    });
    */
    res.send("계정생성완료");
});

module.exports = router;