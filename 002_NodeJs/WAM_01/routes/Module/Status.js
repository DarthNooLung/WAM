/*
상태값을 최초 불러올때는 제외하고는 계속 변수에 담고 있음
관리자페이지에서 상태값 변경 처리 할경우 DB 업데이트 처리 기능 필요
*/
var mDa = require("./DataAccess");

//ActionId가 사용 가능한지 체크
var arrActionStatus = new Array();

//ActionId의 상태를 업데이트 하는 함수
function fnSetStatus(strActionId, isStatus) {
    var isExists = false;
    
    for(var i = 0; i < arrActionStatus.length; i++)
    {
        var arrTmp = arrActionStatus[i];

        //Action값이 존재 할 경우
        if(arrTmp[0] == strActionId) 
        {
            isExists = true;
            arrTmp[1] = isStatus;

            arrActionStatus[i] = arrTmp;
        }
    }

    //대상 ActionId값이 없을 경우
    if(!isExists)
    {
        var arrTmp = [strActionId, false];
        arrActionStatus.push(arrTmp);
    }
}
module.exports.SetStatus = fnSetStatus;

//ActionId 값을 가져오는 함수
function fnGetStatus(strActionId)
{
    var isChk = false;
    var isExists = false;
    
    for(var i = 0; i < arrActionStatus.length; i++)
    {
        var arrTmp = arrActionStatus[i];
        if(arrTmp[0] == strActionId) 
        {
            isExists = true;
            //값 할당
            isChk = arrTmp[1];
        }
    }
    
    console.log(isExists);
    //값이 변수에 할당 안되어 있을 경우
    if(!isExists)
    {
        isChk = mDa.ActionIdUseCheck(strActionId);
        console.log(isChk);
        var arrTmp = [strActionId, isChk];
        arrActionStatus.push(arrTmp);
    }

    return isChk;
}
module.exports.GetStatus = fnGetStatus;