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