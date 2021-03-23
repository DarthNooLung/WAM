const mDWRA = require("../DataAccess/Execute/DaWamRecentAction");

//최근 Action 정보 등록
function fnRecentActionInsert(ActionId, MyOrd)
{
    mDWRA.RecentActionInsert(ActionId, MyOrd);
}
module.exports.RecentActionInsert = fnRecentActionInsert;

//최근 Action 정보 삭제
function fnRecentActionDelete(ActionId, MyOrd)
{
    mDWRA.RecentActionDelete(ActionId, MyOrd);
}
module.exports.RecentActionDelete = fnRecentActionDelete;