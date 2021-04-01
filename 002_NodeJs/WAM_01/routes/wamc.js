const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mStatus = require("./Module/Status");
var mRecentAction = require("./Module/RecentAction");

router.get('/', async (req, res) => {
    //ActionId & 키값이 존재하는지 체크
    if(req.query.ActionId != undefined && req.query.WamKey != undefined && req.query.ActionId != "" && req.query.WamKey != "") {
        var strActionId = req.query.ActionId;        
        //ActionId가 사용 가능 할 경우
        if(await mStatus.GetStatus(strActionId)){
            var strWamKey = decodeURIComponent(req.query.WamKey);
            //키값 복호화
            strWamKey = mCommon.AesDec(strWamKey);

            //키값에서 내 순번 가져오기
            var arrWamKey = strWamKey.split("_");

            //3개의 값으로 이루어져 있는지 체크
            if(arrWamKey.length == 3) {
                var iMyOrd = arrWamKey[2];
                var iCaclSec = 15;

                //처리하고자 하는 초가 있을 경우
                if(req.query.WamSec != undefined && req.query.WamSec != "") {
                    //숫자형인지 체크
                    if(!isNaN(req.query.WamSec)) {
                        iCaclSec = Number(req.query.WamSec) * 10 + 5;
                    }
                }

                mRecentAction.RecentActionCalcSecUpdate(strActionId, iMyOrd, iCaclSec);
            }
        }
    }
    res.send("");
});

module.exports = router;