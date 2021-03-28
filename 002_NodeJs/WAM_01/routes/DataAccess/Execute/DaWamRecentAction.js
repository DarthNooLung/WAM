const WamRecentAction = require("../Schema/WamRecentAction");
const mCommon = require("../../Module/Common");
const mCount = require("../../Module/Count");

//최근 Action 정보 등록
function fnRecentActionInsert(ActionId, MyOrd)
{
    var nowDt = new Date();
    var iYear = nowDt.getFullYear();
    var iMonth = nowDt.getMonth() + 1;
    var iDay = nowDt.getDate();
    var iHour = nowDt.getHours();
    var iMinute = nowDt.getMinutes();
    var iSecond = nowDt.getSeconds();


    var iOrd01 = Number(MyOrd) % 10;
    var iOrd02 = (iOrd01 + 5) % 10;

    //동일한 시간대가 아닌 본인의 순번에 따른 분산으로 저장 처리(한번은 안될 수 있어서 2개로 함)
    if(iSecond % 10 == iOrd01 || iSecond % 10 == iOrd02)
    {
        var iTime = String(iYear) + mCommon.LPad(String(iMonth), 2, "0") + mCommon.LPad(String(iDay), 2, "0") + mCommon.LPad(String(iHour), 2, "0") + mCommon.LPad(String(iMinute), 2, "0");
        console.log(iTime);
        WamRecentAction.updateOne
        (
            {ActionId: ActionId, MyOrd: MyOrd},
            {
                ActionId: ActionId,
                MyOrd: MyOrd,
                LastTime: Number(iTime)
            },
            { upsert : true }
        )
        .then(result => {
            return true;
        })
        .catch(err => {
            return false;
        });
    }
    else
    {
        return true;
    }
}
module.exports.RecentActionInsert = fnRecentActionInsert;


//최근 Action 정보 등록
function fnRecentActionDelete(ActionId, MyOrd)
{
    WamRecentAction.deleteOne({ActionId: ActionId, MyOrd: MyOrd})
    .then(result => {
        return true;
    })
    .catch(err => {
        return false;
    });
}
module.exports.RecentActionDelete = fnRecentActionDelete;

//시간 지난 Action 리스트 처리 하기
function fnActionRemove()
{
    //현재시간에서 2분 빼기
    var nowDt = new Date();
    nowDt.setMinutes(nowDt.getMinutes() - 2);
    var iYear = nowDt.getFullYear();
    var iMonth = nowDt.getMonth() + 1;
    var iDay = nowDt.getDate();
    var iHour = nowDt.getHours();
    var iMinute = nowDt.getMinutes();
    var iTime = String(iYear) + mCommon.LPad(String(iMonth), 2, "0") + mCommon.LPad(String(iDay), 2, "0") + mCommon.LPad(String(iHour), 2, "0") + mCommon.LPad(String(iMinute), 2, "0");
    iTime = Number(iTime);

    //최종 상태변경값이 2분 이전일 경우(튕기거나 나간 사람으로 간주)
    WamRecentAction.aggregate
    (
        [
            {$match:{LastTime: {$lte: iTime}}},
            {
                $group: 
                {
                    //_id:{ActionId: "$ActionId"} //여러개를 할경우
                    _id: "$ActionId",
                    TotCnt: {$sum: 1}
                }
            }
        ],
        function(err,data){
            if(data){
                for(var i = 0; i < data.length; i++)
                {
                    //카운트와 잔여 카운트에 대한 갭을 매꿀 방법을 찾아봅시다.
                    //ActionId의 CountUp 처리
                    mCount.NowOrdUp(data[i]._id, data[i].TotCnt);
                    
                    //RecentActionLog 삭제
                    WamRecentAction.deleteMany
                    (
                        {LastTime: {$lte: iTime}}
                    )
                    .then(Data => {
                    })
                    .catch(err => {
                    });
                }
            } 
        }
    );
}
module.exports.ActionRemove = fnActionRemove;