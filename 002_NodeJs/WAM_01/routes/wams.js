const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mCount = require("./Module/Count");

router.get('/', (req, res) => {
    //return 값을 Jquery로 처리
    var rtnVal = {
        isError: true,
        RtnType: "WAIT",
        TotCnt: 0,
        NowOrd: 0,
        MyOrd: 0
    };

    if(req.query.ActionId != undefined)
    {
        var strActionId = req.query.ActionId;

        if(strActionId != "")
        {
            //ActionId가 사용 가능 할 경우
            if(mCommon.ActionIdUseCheck(strActionId)){
                var arrAction = mCount.GetList(strActionId);
                
                //전체 사용자수 증가
                mCount.TotCountUp(strActionId);
                
                //전체 사용자 수 반환값에 할당
                rtnVal.TotCnt = arrAction[1];

                 //현재까지 완료된 수 할당
                 rtnVal.NowOrd = arrAction[2];

                //내 순번을 맨 마지막 번으로 할당
                rtnVal.MyOrd = arrAction[1];

                //Unique한 키값을 생성후 Client 쿠키 생성
                var strGuid = mCommon.GetGuid();
                //ActionId_유니크키_내순번
                var strCookie = strActionId + "_" + strGuid + "_" + String(rtnVal.MyOrd);
                //키값 암호화
                strCookie = mCommon.AesEnc(strCookie);
                //console.log(strCookie);
                res.cookie("WamActionId", strCookie);

                //ActionId / UniqueKey / Staus[I/O] / InsertDt - 추후 기능개발 필요 (In Out Log 쌓기)
                
                rtnVal.isError = false;
                //console.log(arrAction);
            }
        }
    }
    //console.log(rtnVal);
    rtnVal ="fnWamResult(" + JSON.stringify(rtnVal) + ")";
    res.send(rtnVal);
});

module.exports = router;