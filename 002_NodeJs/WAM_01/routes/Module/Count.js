//Class를 통하여 각 ID의 키를 가지고 가기
var arrMaster = new Array();

//Action Id의 초기 정보 셋팅
function fnCreateList(strActionId)
{
    //[ActionId, 전체순번, 현재완료된순번]
    var arrActionInfor = [strActionId, 0, 0];
    return arrActionInfor;
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

module.exports.GetList = fnGetList;
module.exports.TotCountUp = fnTotCountUp;