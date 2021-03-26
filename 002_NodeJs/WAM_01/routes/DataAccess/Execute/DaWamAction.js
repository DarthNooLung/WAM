const WamAction = require("../Schema/WamAction");

//ActionLog 쌓기
function fnActionLogInsert(ActionId, WamKey, OrdNo) {
    return WamAction.create({
        ActionId: ActionId, 
        WamKey: WamKey,
        OrdNo: OrdNo
    })
    .then(result => {
        return true;
    })
    .catch(err => {
        return false;
    });
}
module.exports.ActionLogInsert = fnActionLogInsert;

//ActionLog Out Update
function fnActionLogUpdate(ActionId, WamKey, OrdNo) {
    return WamAction.updateOne(
        {
            ActionId: ActionId, 
            WamKey: WamKey,
            OrdNo: OrdNo
        },
        {
            OutDt: Date.now()
        }
    )
    .then(result => {
        return true;
    })
    .catch(err => {
        return false;
    });
}
module.exports.ActionLogUpdate = fnActionLogUpdate;