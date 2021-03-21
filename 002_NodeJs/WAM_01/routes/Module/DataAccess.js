const WamMaster = require("../DataAccess/Schema/WamMaster");

//Action ID가 사용 가능한지 체크
async function fnActionIdUseCheck(strActionId) {
    return await WamMaster.find({ActionId: strActionId, UseYn: true})
    .then(Data => {        
        if(Data.length == 1) {
            return true;
        }
        else {
            return false;
        }
    })
    .catch(err => {
        return false;
    });
}
module.exports.ActionIdUseCheck = fnActionIdUseCheck;