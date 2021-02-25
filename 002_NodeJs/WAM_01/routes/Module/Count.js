var mStorageFile = require("./StorageFile");
var mActionInfor = require("./ActionInfor");

//Class를 통하여 각 ID의 키를 가지고 가기
var arrMaster = new Array();

//Action Id의 초기 정보 셋팅
function fnCreateList(strActionId)
{    
    //[ActionId, 전체순번, 현재완료된순번, 동시접속처리자수]
    var arrActionInfor = [strActionId, 0, 0, 1];

    //파일이 존재 하는지 체크
    var isChk = mStorageFile.FileCheck("ActionMaster.dat");

    //파일이 존재하지 않을경우
    if(!isChk){
        isChk = mActionInfor.ActionListCreate(strActionId, 0, 0, 1);
    }
    //파일이 존재 할 경우
    else{
        var strJson = mStorageFile.ReadFile("ActionMaster.dat");
        //파일은 존재하는데 값이 없을 경우
        if(strJson == "") {
            isChk = mActionInfor.ActionListCreate(strActionId, 0, 0, 1);
        }
        //내용이 있을경우
        else {
            var dtActionList = JSON.parse(strJson).ActionList;
            isChk = false;
            for(var i = 0; i < dtActionList.length; i++) {
                //동일한 ActionId가 존재 할 경우
                if(dtActionList[i].ActionId == strActionId) {
                    isChk = true;
                    arrActionInfor = [strActionId, dtActionList[i].TotCnt, dtActionList[i].NowOrd, dtActionList[i].AccCnt];
                }
            }
            
            //동일한 아이디가 없을 경우
            if(!isChk) {
                isChk = mActionInfor.ActionListAdd(dtActionList, strActionId, 0, 0, 1);
            }
        }
    }

    return arrActionInfor;
}



//Action Id의 정보 가져오기
function fnGetList(strActionId)
{
    var arrRtnVal;
    if(arrMaster.length == 0)
    {
        var arrRtnVal = fnCreateList(strActionId);
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
            arrRtnVal = fnCreateList(strActionId);
        }
    }

    return arrRtnVal;
}

//전체 카운트 증가
function fnTotCountUp(strActionId){
    for(var i = 0; i < arrMaster.length; i++)
    {
        var arrTmpVal = arrMaster[i];

        if(arrTmpVal[0] == strActionId)
        {
            arrTmpVal[1]++;
            arrMaster[i] = arrTmpVal;
        }
    }
}

module.exports.GetList = fnGetList;
module.exports.TotCountUp = fnTotCountUp;