var mStorageFile = require("./StorageFile");
var mActionInfor = require("./ActionInfor");
var mDa = require("./DataAccess");

//Class를 통하여 각 ID의 키를 가지고 가기
var arrMaster = new Array();

//Action Id의 초기 정보 셋팅
async function fnCreateList(strActionId)
{    
    //[ActionId, 전체순번, 현재완료된순번, 동시접속처리자수]
    var arrActionInfor = [strActionId, 0, 0, 1];

    //데이터는 무조건 있음 이게 없으면 여기까지 실행이 안됨
    var objActionInfor = await mDa.ActionIdInfo(strActionId);

    arrActionInfor[1] = objActionInfor.TotCnt;
    arrActionInfor[2] = objActionInfor.NowOrd;
    arrActionInfor[3] = objActionInfor.AccCnt;

    return arrActionInfor;
}


//Action Id의 정보 가져오기
async function fnGetList(strActionId)
{
    var arrRtnVal;
    if(arrMaster.length == 0)
    {
        var arrRtnVal = await fnCreateList(strActionId);
        arrMaster.push(arrRtnVal);
    }
    else
    {
        var isActionIdExists = false;
        for(var i = 0; i < arrMaster.length; i++)
        {
            var arrTmpVal = arrMaster[i];

            if(arrTmpVal[0] == strActionId)
            {
                arrRtnVal = arrTmpVal;
                isActionIdExists = true;
            }
        }

        if(!isActionIdExists)
        {
            arrRtnVal = await fnCreateList(strActionId);
        }
    }

    return arrRtnVal;
}
module.exports.GetList = fnGetList;

//전체 카운트 증가
async function fnTotCountUp(strActionId){
    for(var i = 0; i < arrMaster.length; i++)
    {
        var arrTmpVal = arrMaster[i];

        if(arrTmpVal[0] == strActionId)
        {
            arrTmpVal[1]++;
            arrMaster[i] = arrTmpVal;

            if(arrTmpVal[1] % 10 == 0){
                mActionInfor.ActionIdUpdate(strActionId, "TotCnt", arrTmpVal[1]);
            }
        }
    }
}
module.exports.TotCountUp = fnTotCountUp;

//NowOrder 증가 처리
function fnNowOrdUp(strActionId){
    for(var i = 0; i < arrMaster.length; i++)
    {
        var arrTmpVal = arrMaster[i];

        if(arrTmpVal[0] == strActionId)
        {
            arrTmpVal[2]++;
            arrMaster[i] = arrTmpVal;

            if(arrTmpVal[2] % 10 == 0){
                mActionInfor.ActionIdUpdate(strActionId, "NowOrd", arrTmpVal[2]);
            }
        }
    }
    console.log(arrMaster);
}
module.exports.NowOrdUp = fnNowOrdUp;