const express = require('express');
const router = express.Router();
var mCommon = require("./Module/Common");
var mStatus = require("./Module/Status");
var mCount = require("./Module/Count");
var mActionLog = require("./Module/ActionLog");

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

    if(req.query.ActionId != undefined)
    {
        var strActionId = req.query.ActionId;

        if(strActionId != "")
        {
            //ActionId가 사용 가능 할 경우
            if(await mStatus.GetStatus(strActionId)){
                var arrAction = await mCount.GetList(strActionId);

                //전체 사용자수 증가
                await mCount.TotCountUp(strActionId);
                
                //전체 사용자 수 반환값에 할당
                rtnVal.TotCnt = arrAction[1];

                //현재까지 완료된 수 할당
                rtnVal.NowOrd = arrAction[2];

                //내 순번을 맨 마지막 번으로 할당
                rtnVal.MyOrd = arrAction[1];

                //Unique한 키값을 생성후 Client 쿠키 생성
                var strGuid = mCommon.GetGuid();
                
                //ActionId_유니크키_내순번
                var strWamKey = strActionId + "_" + strGuid + "_" + String(rtnVal.MyOrd);
                //In Log 쌓기
                mActionLog.ActionLogInsert(strActionId, strWamKey, rtnVal.MyOrd);
                //키값 암호화
                strWamKey = mCommon.AesEnc(strWamKey);
                strWamKey = encodeURIComponent(strWamKey);

                //res.cookie("WamActionId", strWamKey);
                rtnVal.WamKey = strWamKey;

                if(Number(rtnVal.MyOrd) - Number(rtnVal.NowOrd) <= Number(arrAction[3])) {
                    rtnVal.RtnType = "PASS";
                }
                
                rtnVal.isError = false;
                //console.log(arrAction);
            }
            else {
                rtnVal.Msg = "등록되지 않은 아이디 입니다.";
            }
        }
    }
    rtnVal ="wamResult(" + JSON.stringify(rtnVal) + ")";
    res.send(rtnVal);
});

module.exports = router;