/*
* name : TRIM
* description : remove blank space
*/
String.prototype.trim = function () {
    var s = (this != null) ? this : "";
    s = s.replace(/^\s+/g, "");
    s = s.replace(/\s+$/g, "");
    return s;
}

/*
* name : removeTag
* description : remove html tag from string
*/
String.prototype.removeTag = function () {
    var s = (this != null) ? this : "";
    s = s.replace(/<\/?[^>]+>/gi, "");
    return s;
}
String.prototype.replace2 = function (source, target) {

    var s = (this != null) ? this : "";
    var Array = s.split(source);
    for (var i = 0; i < Array.length; i++) {

        var t = "value=\"" + target + "\"";
        var o = "value=" + source;
        s = s.replace(o, t).replace(source, target);
    }
    return s;
}

/*
* name : RPAD
*/

function PadRight(srcStr, strLen, addChar)	//srcStr:원래변수	strLen:만들 자리수	addChar:반복해서붙일 문자
{
    if (srcStr.length >= strLen)
        return srcStr;

    while (srcStr.length != strLen) {
        srcStr += addChar;
    }

    return srcStr;
}

/*
* name : LPAD
*/
function PadLeft(srcStr, strLen, addChar)	//srcStr:원래변수	strLen:만들 자리수	addChar:반복해서붙일 문자
{
    if (srcStr.length >= strLen)
        return srcStr;

    while (srcStr.length != strLen) {
        srcStr = addChar + srcStr;
    }

    return srcStr;
}

/*************************************************************************
* name : Common alert
*************************************************************************/
function MessageHandler() {
    this.alert = function (msg) {
        alert(msg);
        return true;
    }

    this.confirm = function (msg) {
        return confirm(msg);
    }
}

var _message = new MessageHandler();

/*************************************************************************
* name : Common Language
*************************************************************************/

function TranslateLanguage() {
    this.GetTranslate = function (code, lang) {
        var rtnValue = "";
        if (rtnValue == "") {
            rtnValue = code;

            try {
                if (g_languageSet) {
                    rtnValue = g_languageSet[code];
                    if (rtnValue == undefined) {
                        rtnValue = code;
                    }
                }

            }
            catch (e) {
            }


        }
        return rtnValue;
    }

    this.alert = function (code) {
        var msg = this.GetTranslate(code);
        _message.alert(msg);
        return true;
    }

    this.alertText = function (g_messageType) {
        _message.alert(g_messageType);
        return true;
    }

    this.alertHeaderContent = function (code, g_messageType) {
        var msg = this.GetTranslate(code) + " " + g_messageType;
        _message.alert(msg);
        return true;
    }

    this.alertHeaderContentText = function (code, textMessage)
    {
        var msg = this.GetTranslate(code) + " " + this.GetTranslate(textMessage);
        _message.alert(msg);
        return true;
    }

    this.confirm = function (code) {
        var msg = this.GetTranslate(code);
        return _message.confirm(msg);
    }

    this.confirmText = function (g_messageType) {
        return _message.confirm(g_messageType);
    }

    this.confirmHeaderContent = function (code, g_messageType) {
        var msg = this.GetTranslate(code) + " " + g_messageType;
        return _message.confirm(msg);
    }

    this.confirmHeaderContentText = function (code, textMessage) {
        var msg = this.GetTranslate(code) + " " + this.GetTranslate(textMessage);
        return _message.confirm(msg);
    }
}

var _language = new TranslateLanguage();

function RequestValue(requestName)
{
    if (requestName == null) return "";

    if (location.search == null) return "";

    var fullParams = location.search.replace('?', '').split('&');

    if (fullParams == null) return "";

    var col;
    var returnValue;

    for (i = 0; i < fullParams.length; i++)
    {
        col = fullParams[i].split('=');
        if (col != null && col[0] == requestName)
        {
            returnValue = col[1];
            break;
        }
    }
    return returnValue;
}

/******************************************************handler about popup ******************************************************/
function popupHandler() {
    this.windows = new Array();
}

var _popup = new popupHandler();

function hWindow(_id, _width, _height) {
    this.id = null;
    this._params = new Array();
    this.width = 600;
    this.height = 400;
    this.SiteRootPath = null;
    this.Url = null;

    this.onClosed = null;
    this.onControlClosed = null;

    this.returnValues = null;
    if (_id) {
        this.id = _id;
    }

    if (_width) {
        this.width = _width;
    }

    if (_height) {
        this.height = _height;
    }

    try {
        if (g_ROOT_PATH) {
            this.SiteRootPath = g_ROOT_PATH;
        }
    }
    catch (e) {
        try {
            if (__rootPath) {
                this.SiteRootPath = __rootPath;
            }
        }
        catch (e) {
            this.SiteRootPath = "/";
        }
    }
}

//hWindow Object Add
popupHandler.prototype.get_popup = function (popupId, _width, _height) {
    var result = new hWindow();
    var obj = null;
    for (var i = 0; i < this.windows.length; i++) {
        var id = this.windows[i].id;
        if (id != null) {
            if (id.toString().toLowerCase() == popupId.toLowerCase()) {
                obj = this.windows[i];
                break;
            }
        }
    }

    if (obj == null) {
        obj = new hWindow(popupId, _width, _height);
        this.windows.push(obj);
    }
    result = obj;
    return result;
}

//hWindow Parameter ClearParameter
hWindow.prototype.clearParameter = function (navationUrl) {
    this._params = new Array();
}

//hWindow Parameter AddParameter
hWindow.prototype.addParameter = function (_key, _value) {
    this._params.push({ key: _key, value: _value });
}

//hWindowopenDialog
hWindow.prototype.openDialog = function (navationUrl, headerTitle, width, height, scroll, ie11) {
    var dialogId = this.id;
    this.Url = navationUrl;

    if (this.Url.toLowerCase().indexOf('fileuploadpopup.aspx') >= 0 || this.Url.toLowerCase().indexOf('importexcel.aspx') >= 0) {

        width = 300;
        height = 160;
    }

    var v_date1 = new Date();
    var v_year = v_date1.getUTCMilliseconds().toString();

    var dummyUrl = this.SiteRootPath + 'popup/popupdummy.aspx?id=' + dialogId + '&dummy=' + v_year + (ie11 == true? '&browser=11': '');

    if (scroll == null) {
        scroll = "no";
    }

    var feature = 'dialogHeight:' + height + 'px;dialogWidth:' + width + 'px;scroll:' + scroll + ';';

    var tmpParams = this._params;
    this.clearParameter();

    // 부모창 제어를 위한 파라메터 추가
    this.addParameter("$window", window);

    for (i = 0; i < tmpParams.length; i++) {
        this.addParameter(tmpParams[i].key, tmpParams[i].value);
    }

    try {
        if (g_ROOT_PATH) {
            if (this.Url.indexOf('http://') == -1 && this.Url.indexOf('https://') == -1) {
                this.Url = g_ROOT_PATH + this.Url;
            }
        }
    }
    catch (e) {
        try {
            if (__rootPath) {
                this.Url = __rootPath + this.Url;
            }
        }
        catch (e) {
            this.Url = "/" + this.Url;
        }
    }

    this.addParameter("navigationUrl", this.Url);

    if (document.getElementById("menu_id")) {
        this.addParameter("menu_id", document.getElementById("menu_id").value);
    }

    var rtnValue = window.showModalDialog(dummyUrl, this._params, feature);

    if (rtnValue != null) {
        this.setReturnValue(rtnValue);
        if (this.onClosed != null) {
            this.onClosed(this.returnValues);
        }
    }
}

hWindow.prototype.open = function (navationUrl, _width, _height) {
    if (_width != null) {
        this.width = _width;
    }

    if (_height != null) {
        this.height = _height;
    }

    var X = (screen.width - this.width) / 2;
    var Y = (screen.height - this.height) / 2;

    this.Url = navationUrl;
    // make parameter
    //navationUrl += '?' + this.getParameter();
    this.addParameter("menu_id", document.getElementById("menu_id").value);
    
    var frm = this.getPostForm();
    frm.target = this.id;

    if (this.Url.toLowerCase().indexOf('fileuploadpopup.aspx') >= 0 || this.Url.toLowerCase().indexOf('importexcel.aspx') >= 0) {

        this.width = 300;
        this.height = 160;
    }

    // position : center

    var feature = "width=" + this.width + ",left=" + X + ",top=" + Y + ",height=" + this.height + ",scrollbars=yes";
    window.open('', this.id, feature);
    frm.submit();
}

hWindow.prototype.open2 = function (navationUrl, feature, _width, _height) {
    if (_width != null) {
        this.width = _width;
    }

    if (_height != null) {
        this.height = _height;
    }

    var X = (screen.width - this.width) / 2;
    var Y = (screen.height - this.height) / 2;

    this.Url = navationUrl;

    var frm = this.getPostForm();
    frm.target = this.id;

    if (this.Url.toLowerCase().indexOf('fileuploadpopup.aspx') >= 0 || this.Url.toLowerCase().indexOf('importexcel.aspx') >= 0) {

        this.width = 300;
        this.height = 160;
    }

    // position : center

    window.open('', this.id, feature);
    frm.submit();
}


hWindow.prototype.getX = function () {
    if (this.X == null) this.X = (screen.width - this.getWidth()) / 2;
    return this.X;
}

hWindow.prototype.getY = function () {
    if (this.Y == null) this.Y = (screen.height - this.getHeight()) / 2;
    return this.Y;
}

hWindow.prototype.getPostForm = function () {
    var _url = this.Url; // (this.SiteRootPath != null) ? this.SiteRootPath + this.Url : this.Url;
    var frm = document.getElementById('_auto_frm');

    if (frm != null) {
        window.document.body.removeChild(frm);
    }
    var frm = window.document.createElement("FORM");
    frm.setAttribute("style", "display:none");
    frm.setAttribute("id", "_auto_frm");
    frm.setAttribute("method", "post");
    frm.setAttribute("name", "_auto_frm");
    window.document.body.appendChild(frm);
    for (var i = 0; i < this._params.length; i++) {
        this.appendFormElement(frm, this._params[i].key, this._params[i].value);
    }


    frm.method = 'post';

    frm.action = _url;
    return frm;
    //frm.submit();
}

hWindow.prototype.appendFormElement = function (frm, key, val) {
    if (document.getElementById(this.id + "__" + key) == undefined) {
        var obj = window.document.createElement("input");
        obj.setAttribute("type", "hidden");
        obj.setAttribute("id", this.id + "__" + key);
        obj.setAttribute("name", key);
        obj.value = val;
        frm.appendChild(obj);
    }
}


hWindow.prototype.setReturnValue = function (args) {
    if (args[0] == "NoSessionHKH") {
        self.location.href = g_ROOT_PATH + "SessionExpire.aspx";
        return false;
    }
    else {
        this.returnValues = new Array();
        for (var i = 0; i < args.length; i++) {
            this.returnValues.push(args[i]);
        }
    }
}

/******************************************************handler about popup ******************************************************/


/*********************************************************
name : g_EnterSearch
description : Enter Search
*********************************************************/
function g_EnterSearch(objName, eventObj) {
    if (eventObj == 13) {
        document.getElementById(objName).focus();
        __doPostBack(objName, "");
    }
}

/*********************************************************
name : g_FrameResize
description : Main Frame Resize
*********************************************************/
function ScriptUtility()
{
}
ScriptUtility.prototype.getClassForDateTime = function (date)
{
    var v_date1 = new Date(date);
    var v_year = v_date1.getFullYear().toString();
    var v_month = PadLeft((v_date1.getMonth() + 1).toString(), 2, "0");
    var v_day = PadLeft(v_date1.getDate().toString().toString(), 2, "0");
    var v_fullDate = v_year + '' + v_month + '' + v_day;
    var v_HH = v_date1.getHours().toString();
    var v_MM = v_date1.getMinutes().toString();

    return { Year: v_year, Month: v_month, Day: v_day, FullDate: v_fullDate, Hour: v_HH, Minute: v_MM };
}

var _util = new ScriptUtility();

/*********************************************************
name : g_FileDown
description : fileDown
*********************************************************/
function g_FileDown(id) {
    var frm = window.document.createElement("iframe");
    frm.setAttribute("style", "display:none");
    frm.setAttribute("id", "_auto_ifrm");
    frm.setAttribute("name", "_auto_ifrm");
    window.document.body.appendChild(frm);
    _auto_ifrm.location.href = g_ROOT_PATH + "Handler/getFileStream.aspx?id=" + id;
}

function g_FileDownExcel(filePath) {
    var frm = window.document.createElement("iframe");
    frm.setAttribute("style", "display:none");
    frm.setAttribute("id", "_auto_ifrm");
    frm.setAttribute("name", "_auto_ifrm");
    window.document.body.appendChild(frm);
    _auto_ifrm.location.href = g_ROOT_PATH + "Handler/getFileStream.aspx?fileType=EXCEL&filePath=" + filePath;
}

function g_FileDown2(filePath, fileName) {
	var frm = window.document.createElement("iframe");
	frm.setAttribute("style", "display:none");
	frm.setAttribute("id", "_auto_ifrm");
	frm.setAttribute("name", "_auto_ifrm");
	window.document.body.appendChild(frm);
	//_auto_ifrm.location.href = g_ROOT_PATH + "Handler/getFileStream.aspx?filePath=" + filePath + "&fileName=" + fileName;
	_auto_ifrm.location.href = g_ROOT_PATH + "Handler/getFileStreamContents.aspx?fileName=" + fileName;
}

function showDialogWindow(id) {
    $find(id).set_windowState($IG.DialogWindowState.Normal);
}


/*************************************************************
컨트롤 필수입력 Validation Check
현재 지원되는 컨트롤 : textbox, dropdownlist, hiddenfield

문의사항은 차용태 에게로..
누구나 수정, 추가 가능..삭제는 안됨..-_-;;

사용예시 :
if (ReqValCheck("<%=txtCourseName.ClientID %>","교육과정명")&&
    ReqValCheck("<%=ddlEduCate1Step.ClientID %>", "교육범주")&&
    ReqValCheck("<%=ddlEduCate2Step.ClientID %>", "교육범주")&&
    ReqValCheck("<%=ddlEduCate3Step.ClientID %>", "교육범주")&&
    ReqValCheck("<%=txtEduTarget.ClientID %>", "교육대상")&&
    ReqValCheck("<%=txtEduGoal.ClientID %>", "교육목표") &&                
    ReqValCheck("<%=ddlEduKind.ClientID %>", "교육종류") &&
    ReqValCheck("<%=ddlEduType.ClientID %>", "교육형태") &&
    ReqValCheck("<%=hidEduCompCode.ClientID %>", "교육업체") &&
    ReqValCheck("<%=ddlLectureType.ClientID %>", "강의형태") &&

    ReqValCheck("scEmp_txtEmpnoFull", "관리자") &&

    ReqValCheck("<%=hidProfessor.ClientID %>", "대표강사") &&
    ReqValCheck("<%=txtEduTermMonths.ClientID %>", "학습기간") &&
    ReqValCheck("<%=txtEduTermDays.ClientID %>", "학습기간") &&
    ReqValCheck("<%=txtEduTermTimes.ClientID %>", "학습기간") &&
    ReqValCheck("<%=ddlEduStep.ClientID %>", "교육단계")
    )                
    return false;
else
    return false;
*************************************************************/
function ReqValCheck(ClientID, ReqName) {
    var ctl = document.getElementById(ClientID);
    if (ctl != undefined && ctl != null) {
        if (ctl.type == "select-one" && ctl.selectedIndex == 0) {
            _language.alertHeaderContent(ReqName, g_SELECTED);

            ctl.focus();
            return false;
        } else if (ctl.value == "") {
            _language.alertHeaderContent(ReqName, g_REQUIRE_FIELD);

            if (ctl.type != "hidden" && ctl.style.display != "none")
                ctl.focus();
            return false;
        }
    }
    return true;
}

//------------------------------------------------------세션 죽었을때 처리

var _hkhLogoutChk = 0;
var _hkhOpenChk = false;
function RecursiveUpperPage(objWindow) {
    _hkhLogoutChk++;
    try {
        window.parent.parent.parent.parent.LogOut(g_NO_SESSION);
        return;
    }
    catch (e) {
    }
    try {
        if (_hkhLogoutChk < 20) {
            if (window.parent.parent.parent.parent.parent.parent.opener != null) {                
                _language.alertText(g_NO_SESSION);
                window.parent.parent.parent.parent.parent.parent.opener.parent.parent.parent.parent.parent.parent.location.href = g_ROOT_PATH + 'login.aspx';
                window.parent.parent.parent.parent.parent.close();
            }
            else if (window.parent.parent.parent.parent.parent.parent != null) {
                _language.alertText(g_NO_SESSION);
                window.parent.parent.parent.parent.parent.parent.location.href = g_ROOT_PATH + 'login.aspx';
            }
            else {
                if (window.parent != null) {
                    _language.alertText(g_NO_SESSION);
                    window.parent.location.href = g_ROOT_PATH + 'login.aspx';
                }
                else if (window.opener != null) {
                    _language.alertText(g_NO_SESSION);
                    window.opener.location.href = g_ROOT_PATH + 'login.aspx';
                    self.close();
                }
                else {
                    _language.alertText(g_NO_SESSION);
                    self.location.href = g_ROOT_PATH + 'login.aspx';
                }                
            }
        }
        else {            
            if (window.parent != null) {
                _language.alertText(g_NO_SESSION);
                window.parent.location.href = g_ROOT_PATH + 'login.aspx';
            }
            else if (window.opener != null) {
                _language.alertText(g_NO_SESSION);
                window.opener.location.href = g_ROOT_PATH + 'login.aspx';
                self.close();
            }
            else {
                _language.alertText(g_NO_SESSION);
                self.location.href = g_ROOT_PATH + 'login.aspx';
            }
        }
    }
    catch (e) {
        _language.alertText(g_NO_SESSION);        
        self.location.href = g_ROOT_PATH + 'login.aspx';
    }
}

function CallLogOut(objWindow,tmpWindow) {
    if (_hkhOpenChk) {
        self.close();
    }
    objWindow.LogOutAdmin(g_ROOT_PATH);
}

/*
* 함수명 : Validator
* 설명 : Validation Check
*/
function Validator() {
    return this.construct();
}

Validator.prototype = {
    //개체 생성
    construct: function () {
        return this;
    },
    //존재하지 않을 시
    isDefined: function (x) {
        return typeof (x) != "undefined";
    },
    //날짜형 체크
    isDate: function (intYear, intMonth, intDay) {
        if (!this.isDefined(intYear) || !this.isDefined(intMonth) || !this.isDefined(intDay)) {
            return false;
        }

        if (Number(intMonth) == 1 || Number(intMonth) == 3 || Number(intMonth) == 5 || Number(intMonth) == 7 || Number(intMonth) == 8 || Number(intMonth) == 10 || Number(intMonth) == 12) {
            if (Number(intDay) > 31) {
                return false;
            }
        }
        else if (Number(intMonth) == 4 || Number(intMonth) == 6 || Number(intMonth) == 9 || Number(intMonth) == 11) {
            if (Number(intDay) > 30) {
                return false;
            }
        }
        else if (Number(intMonth) == 2) {
            if (Number(intYear) % 4 == 0) {
                if (Number(intDay) > 29) {
                    return false;
                }
            }
            else {
                if (Number(intDay) > 28) {
                    return false;
                }
            }
        }
        else {
            return false;
        }

        return true;
    }
}

var ehr_valid = new Validator();

/*
* 함수명 : DateCheck
* 설명 : 날짜 체크
*/
function DateCheck(obj) {
    var tmpDate = obj.value.trim().replace("-", "").replace("-", "").replace("-", "").replace("-", "");
    if (tmpDate.length != 8 && tmpDate.length != 0) {
        _language.alert("msg_날짜_형식_오류");
        obj.value = "";
        obj.focus();
        return false;
    }
    var tmpYear = tmpDate.substr(0, 4);
    var tmpMonth = tmpDate.substr(4, 2);
    var tmpDay = tmpDate.substr(6, 2);
    var isChk = ehr_valid.isDate(Number(tmpYear), Number(tmpMonth), Number(tmpDay));

    if (!isChk) {
        if (tmpDate.length > 0) {
            _language.alert("msg_날짜_형식_오류");
            obj.value = "";
            obj.focus();
            return false;
        }
    }
    else {
        obj.value = tmpYear + "-" + tmpMonth + "-" + tmpDay;
        if (obj.value.length != 10) {
            obj.value = "";
        }
    }
}
/*
window.onload = function () {
    //부정한 방법으로 접근시 처리
    //alert(window.top.location);
    //alert(isRequireSession);
    
}
*/

function gfCommaNum(num) {
    var len, point, str;

    num = num + "";
    point = num.length % 3
    len = num.length;

    str = num.substring(0, point);
    while (point < len) {
        if (str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }
    return str;
}

function gfZeroCheck(obj) {
    var rtnValue = String(obj);
    if (Number(obj) < 10) {
        rtnValue = "0" + String(obj);
    }
    return rtnValue;
}

window.onresize = function () {
    try {
        if (typeof fnLayout == 'function') fnLayout();
    }
    catch (e) {
    }
}

//Get Querystring.
function getParameterByName(name, url) {
    if (!url) url = unescape(window.location.href);
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase(); // This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}