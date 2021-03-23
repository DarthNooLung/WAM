const WamMaster = require("../DataAccess/Schema/WamMaster");

//Action ID가 사용 가능한지 체크
function fnActionIdUseCheck(strActionId) {
    return WamMaster.find({ActionId: strActionId, UseYn: true})
    .then(Data => {        
        if(Data.length == 1) {
            return true;
        }
        else {
            return false;
        }
    })
    .catch(err => {
        return false;
    });
}
module.exports.ActionIdUseCheck = fnActionIdUseCheck;

//Action ID의 상세 정보 구하기
function fnActionIdInfo(strActionId)
{
    return WamMaster.find({ActionId: strActionId, UseYn: true})
    .then(Data => {
        var rtnVal = {
            isError: true,
            ActionId: strActionId,
            TotCnt: 0,
            NowOrd: 0,
            AccCnt: 0,
            Msg: "",
        };
        if(Data.length == 1) {
            rtnVal.isError = false;
            rtnVal.TotCnt = Data[0].TotCnt;
            rtnVal.NowOrd = Data[0].NowOrd;
            rtnVal.AccCnt = Data[0].AccCnt;
            return rtnVal;
        }
        else {
            rtnVal.Msg = "No Data";
            return rtnVal;
        }
    })
    .catch(err => {
        var rtnVal = {
            isError: true,
            ActionId: strActionId,
            TotCnt: "",
            NowOrd: 0,
            AccCnt: 0,
            Msg: err,
        };
        //return JSON.stringify(rtnVal);
        return rtnVal;
    });
}
module.exports.ActionIdInfo = fnActionIdInfo;

//Action ID 정보 업데이트
function fnActionIdUpdate(ActionId, Status, UpVal)
{
    if(ActionId != "" && Status != "" && UpVal != "") 
    {
        if(Status == "TotCnt")
        {
            //몽구스를 통한 업데이트
        }
        else if(Status == "NowOrd")
        {
            //몽구스를 통한 업데이트
        }
    }
    else
    {
        return false;
    }
}
module.exports.ActionIdUpdate = fnActionIdUpdate;