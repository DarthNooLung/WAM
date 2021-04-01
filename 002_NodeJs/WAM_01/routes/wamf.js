const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mStatus = require("./Module/Status");
var mCount = require("./Module/Count");
var mActionLog = require("./Module/ActionLog");
var mRecentAction = require("./Module/RecentAction");

router.get('/', async (req, res) => {
     //return 값을 Jquery로 처리
     var rtnVal = {
        isError: true,
        RtnType: "DONE",
        Msg: "",
    };

    if(req.query.ActionId != undefined) {
        var strActionId = req.query.ActionId;
        
        if(strActionId != "") {            
            //ActionId가 사용 가능 할 경우
            if(await mStatus.GetStatus(strActionId)){
                var arrAction = await mCount.GetList(strActionId);

                //현재까지 완료된 수 할당
                var iNowOrd = arrAction[2];
                
                 //키값이 존재하는지 체크
                 if(req.query.WamKey != undefined) {
                    var strWamKey = decodeURIComponent(req.query.WamKey);
                    //키값 복호화
                    strWamKey = mCommon.AesDec(strWamKey);

                    //키값에서 내 순번 가져오기
                    var arrWamKey = strWamKey.split("_");

                    //3개의 값으로 이루어져 있는지 체크
                    if(arrWamKey.length == 3) {
                        var iMyOrd = arrWamKey[2];
                        //내순번 - 현재순번 <= 허용범위 카운트일 경우 반환값을 finish 처리
                        if(Number(iMyOrd) - Number(iNowOrd) <= Number(arrAction[3])) {
                            mCount.NowOrdUp(strActionId, 1);
                            //최근 로그 삭제
                            mRecentAction.RecentActionDelete(strActionId, iMyOrd);
                            //ActionLog OutDt Update
                            mActionLog.ActionLogUpdate(strActionId, strWamKey, iMyOrd);
                            rtnVal.isError = false;
                        }
                    }
                 }
            }
        }
    }
    rtnVal ="wamResult(" + JSON.stringify(rtnVal) + ")";
    res.send(rtnVal);
});

module.exports = router;