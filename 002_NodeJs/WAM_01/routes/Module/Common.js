const crypto = require("crypto")

//GUID 구하는 함수
function fnGetGuid() {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
module.exports.GetGuid = fnGetGuid;

//문자열 암호화
function fnAesEnc(strVal) {
    var rtnVal = "";
    const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.AES_KEY, process.env.AES_IV);
    let result = cipher.update(strVal, "utf8", "base64");
    result += cipher.final("base64");
    return result;
}
module.exports.AesEnc = fnAesEnc;

//문자열 복호화
function fnAesDec(strVal) {
    var rtnVal = "";
    const decipher = crypto.createDecipheriv(process.env.ALGORITHM, process.env.AES_KEY, process.env.AES_IV);
    let result = decipher.update(strVal, "base64", "utf8");
    result += decipher.final("utf8");
    return result;
}
module.exports.AesDec = fnAesDec;