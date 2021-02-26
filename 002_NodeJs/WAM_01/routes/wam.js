const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mCount = require("./Module/Count");


router.get('/', (req, res) => {
    //return 값을 Jquery로 처리
    var rtnVal = {
        isError: true,
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

                //내 순번을 맨 마지막 번으로 할당
                rtnVal.MyOrd = arrAction[1];

                //Unique한 키값을 생성후 Client 쿠키 생성
                var strGuid = mCommon.GetGuid();
                res.cookie("WamActionId", strGuid);

                //ActionId / UniqueKey / Staus[I/O] / InsertDt - 추후 기능개발 필요 (In Out Log 쌓기)
                
                rtnVal.isError = false;

                console.log(arrAction);
            }
        }
    }
    
    res.send(JSON.stringify(rtnVal));
});

module.exports = router;