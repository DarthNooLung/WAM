const WamRecentAction = require("../Schema/WamRecentAction");

//최근 Action 정보 등록
function fnRecentActionInsert(ActionId, MyOrd)
{
    console.log(MyOrd);
    var nowDt = new Date();
    var iYear = nowDt.getFullYear();
    var iMonth = nowDt.getMonth() + 1;
    var iDay = nowDt.getDate();
    var iHour = nowDt.getHours();
    var iMinute = nowDt.getMinutes();
    
    WamRecentAction.updateOne
    (
        {ActionId: ActionId, MyOrd: MyOrd},
        {
            ActionId: ActionId,
            MyOrd: MyOrd,
            Year: iYear,
            Month: iMonth,
            Day: iDay,
            Hour: iHour,
            Minute: iMinute
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