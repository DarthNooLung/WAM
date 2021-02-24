const fs = require('fs');
const pathStorage = __dirname.replace("Module", "Storage\\");

//파일 존재여부 체크
function fnFileCheck(strFileName){    
    var isChk = false;
    var strUseFilePath = pathStorage + strFileName;
    try {
        if(fs.existsSync(strUseFilePath)) {
            isChk = true;
        }
    } catch (err) {
    }
    return isChk;
}
module.exports.FileCheck = fnFileCheck;

//파일 생성
function fnCreateFile(strFileName)
{
    var isRtn = true;
    try
    {
        var strUseFilePath = pathStorage + strFileName;
        fs.writeFileSync(strUseFilePath, "");
    }
    catch(err)
    {
        isRtn = false;
    }
    return isRtn;
}
module.exports.CreateFile = fnCreateFile;