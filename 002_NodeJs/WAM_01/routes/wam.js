const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mCount = require("./Module/Count");


router.get('/', (req, res) => {
    //return 값을 Jquery로 처리
    var rtnVal = "Error";
    if(req.query.ActionId != undefined)
    {
        var strActionId = req.query.ActionId;
        //ActionId가 사용 가능 할 경우
        if(mCommon.ActionIdUseCheck(strActionId)){
            var arrAction = mCount.GetList(strActionId);
            mCount.TotCountUp(strActionId);
            //console.log(arrAction);
        }
    }
    var tmpDt = new Date();
    res.send(rtnVal);
});

module.exports = router;