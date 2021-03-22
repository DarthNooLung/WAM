const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mStatus = require("./Module/Status");
var mCount = require("./Module/Count");

router.get('/', async (req, res) => {
    //return 값을 Jquery로 처리
    var rtnVal = {
        isError: true,
        RtnType: "WAIT",
        WamKey: "",
        TotCnt: 0,
        NowOrd: 0,
        MyOrd: 0,
        Msg: "",
    };

    if(req.query.ActionId != undefined) {
        var strActionId = req.query.ActionId;
        
        if(strActionId != "") {            
            //ActionId가 사용 가능 할 경우
            if(await mStatus.GetStatus(strActionId)){
                var arrAction = mCount.GetList(strActionId);

                //전체 사용자 수 반환값에 할당
                rtnVal.TotCnt = arrAction[1];

                //현재까지 완료된 수 할당
                rtnVal.NowOrd = arrAction[2];

                //키값이 존재하는지 체크
                if(req.query.WamKey != undefined) {
                    var strWamKey = decodeURIComponent(req.query.WamKey);
                    rtnVal.WamKey = encodeURIComponent(strWamKey);

                    //쿠키값 복호화
                    strWamKey = mCommon.AesDec(strWamKey);
                    
                    //쿠키값에서 내 순번 가져오기
                    var arrWamKey = strWamKey.split("_");
                    
                    //3개의 값으로 이루어져 있는지 체크
                    if(arrWamKey.length == 3) {
                        rtnVal.MyOrd = arrWamKey[2];

                        //내순번 - 현재순번 <= 허용범위 카운트일 경우 반환값을 finish 처리
                        if(Number(rtnVal.MyOrd) - Number(rtnVal.NowOrd) <= Number(arrAction[3])) {
                            rtnVal.RtnType = "PASS";
                        }
                        rtnVal.isError = false;
                    }
                }
            }
        }
    }
    //console.log(rtnVal);
    rtnVal ="wamResult(" + JSON.stringify(rtnVal) + ")";
    res.send(rtnVal);
});

module.exports = router;