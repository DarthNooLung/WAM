//Action ID가 사용 가능한지 체크
function fnActionIdUseCheck(strActionId) {
    var isChk = false;

    //Action ID List용 파일에서 정보 가져오기
    isChk = true;
    return isChk;
}


//GUID 구하는 함수
function fnGetGuid() {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports.ActionIdUseCheck = fnActionIdUseCheck;
module.exports.GetGuid = fnGetGuid;