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

    if(req.query.ActionId != undefined) {
        var strActionId = req.query.ActionId;

        if(strActionId != "") {            
            //ActionId가 사용 가능 할 경우
            if(mCommon.ActionIdUseCheck(strActionId)){
                var arrAction = mCount.GetList(strActionId);

                //전체 사용자 수 반환값에 할당
                rtnVal.TotCnt = arrAction[1];

                //쿠키값이 존재하는지 체크
                if(req.cookies.WamActionId != undefined) {
                    var strCookie = req.cookies.WamActionId
                    //쿠키값 복호화
                    strCookie = mCommon.AesDec(strCookie);

                    //쿠키값에서 내 순번 가져오기
                }
            }
        }
    }

    res.send("");
});

module.exports = router;