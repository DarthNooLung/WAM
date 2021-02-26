var mStorageFile = require("./StorageFile");

//Action 아이디 생성
function fnActionListCreate(ActionId, TotCnt, NowOrd, AccCnt) {
    var isChk = false;
    var arrAction = new Array();
    var objAction = new Object();
    objAction.ActionId = ActionId;
    objAction.TotCnt = TotCnt;
    objAction.NowOrd = NowOrd;
    objAction.AccCnt = AccCnt;
    arrAction.push(objAction);

    var objActionList = new Object();
    objActionList.ActionList = arrAction;

    isChk = mStorageFile.WriteFile("ActionMaster.dat", JSON.stringify(objActionList));

    return isChk;
}
module.exports.ActionListCreate = fnActionListCreate;

//ActionId 추가
function fnActionListAdd(ActionList, ActionId, TotCnt, NowOrd, AccCnt) {
    var isChk = false;
    var objAction = new Object();
    objAction.ActionId = ActionId;
    objAction.TotCnt = TotCnt;
    objAction.NowOrd = NowOrd;
    objAction.AccCnt = AccCnt;
    ActionList.push(objAction);

    var objActionList = new Object();
    objActionList.ActionList = ActionList;

    isChk = mStorageFile.WriteFile("ActionMaster.dat", JSON.stringify(objActionList));

    return isChk;
}
module.exports.ActionListAdd = fnActionListAdd;

//ActionId 상태 업데이트
function fnActionIdUpdate(ActionId, Status, UpVal){
    /*
    참고사항
    파일의 존재여부 체크 / ActionId값의 존재 여부 체크를 하지는 않음
    최초 호출시 무조건 생성되기 때문에 별도로 안함
    혹시 추후 문제가 될경우 처리토록
    */
   var isChk = false;
    if(ActionId != "" && Status != "" && UpVal != "") {
        var strJson = mStorageFile.ReadFile("ActionMaster.dat");
        var dtActionList = JSON.parse(strJson).ActionList;
    
        for(var i = 0; i < dtActionList.length; i++) {
            //동일한 ActionId가 존재 할 경우
            if(dtActionList[i].ActionId == ActionId) {
                if(Status == "TotCnt"){
                    dtActionList[i].TotCnt = UpVal;
                    console.log(UpVal);
                }
            }
        }

        var objActionList = new Object();
        objActionList.ActionList = dtActionList;

        isChk = mStorageFile.WriteFile("ActionMaster.dat", JSON.stringify(objActionList));    
    }
    return isChk;
}
module.exports.ActionIdUpdate = fnActionIdUpdate;