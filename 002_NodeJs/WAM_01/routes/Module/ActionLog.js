const mDWA = require("../DataAccess/Execute/DaWamAction");

//ActionLog 쌓기
function fnActionLogInsert(ActionId, WamKey, OrdNo)
{
    mDWA.ActionLogInsert(ActionId, WamKey, OrdNo);
}
module.exports.ActionLogInsert = fnActionLogInsert;