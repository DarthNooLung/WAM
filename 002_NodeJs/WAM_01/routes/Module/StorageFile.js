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

//파일 쓰기
function fnWriteFile(strFileName, strContents)
{
    var isRtn = true;
    try
    {
        var strUseFilePath = pathStorage + strFileName;
        fs.writeFileSync(strUseFilePath, strContents, "utf8");
    }
    catch(err)
    {
        isRtn = false;
    }
    return isRtn;
}
module.exports.WriteFile = fnWriteFile;


//파일 읽기
function fnReadFile(strFileName)
{
    var strRtn = "";
    try
    {
        var strUseFilePath = pathStorage + strFileName;
        strRtn = fs.readFileSync(strUseFilePath, "utf8");
    }
    catch(err)
    {
        strRtn = "";
    }
    return strRtn;
}
module.exports.ReadFile = fnReadFile;