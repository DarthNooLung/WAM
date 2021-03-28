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

//Lpad
function fnLPad(str, padLen, padStr) 
{
    if (padStr.length > padLen) {
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
    {
        str = padStr + str;
    }
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}
module.exports.LPad = fnLPad;

function fnRPad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
    {
        str += padStr;
    }
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}
module.exports.RPad = fnRPad;