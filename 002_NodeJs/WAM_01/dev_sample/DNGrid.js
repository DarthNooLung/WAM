/*
함수명 : gGridControrl
함수설명 : 그리드 함수 초기화
*/
function gGridControrl() {
    this.gridName = null;
    this.gridScriptObjectName = "";
    this.gridWidth = "";
    this.gridHeight = "";
    this.gridHeaderStyle = "";
    this.gridRowOverStyle = "";
    this.gridRowClickStyle = "";
    this.gridRowDoubleClickEvent = "";
    this.gridCellClickEvent = "";
    this.gridColumn = new Array();
    this.gridHeader = true;
}

/*
함수명 : ColumnClear
함수설명 : 컬럼 초기화
*/
gGridControrl.prototype.ColumnClear = function () {
    this.gridColumn = new Array();
}
/*
함수명 : ColumnAdd
함수설명 : 그리드 컬럼 추가
파라미터
columnKey : 컬럼키
columnName : 컬럼명
columnWidth : 컬럼넓이
columnAlign : 컬럼정렬
columnEdit : 컬럼수정가능 여부
columnType : 컬럼타입[Date : 날짜][Number : 숫자][Combo : 셀렉트][Text : 문자][CheckBox : 체크박스]
columnSort : 컬럼소팅
*/
gGridControrl.prototype.ColumnAdd = function (columnKey, columnName, columnWidth, columnAlign, columnEdit, columnType, columnControlId, columnSort, columnHidden) {
    //columnKey가 오브젝트로 들어올 경우 처리하는 부분
    if (typeof columnKey == 'object') {
        var tmpObj = columnKey;
        columnKey = tmpObj.columnKey;
        columnName = tmpObj.columnName;
        columnWidth = tmpObj.columnWidth;
        columnAlign = tmpObj.columnAlign;
        columnEdit = tmpObj.columnEdit;
        columnType = tmpObj.columnType;
        columnControlId = tmpObj.columnControlId;
        columnSort = tmpObj.columnSort;
        columnHidden = tmpObj.columnHidden;
    }
    tmpColumn = new Array();
    tmpColumn.push(columnKey);
    tmpColumn.push(columnName);
    if (columnWidth != null && columnWidth != undefined) {
        tmpColumn.push(columnWidth);
    }
    else {
        tmpColumn.push("100px");
    }
    if (columnAlign != null && columnAlign != undefined) {
        tmpColumn.push(columnAlign);
    }
    else {
        tmpColumn.push("Center");
    }
    if (columnEdit != null && columnEdit != undefined) {
        //HIDDEN일 경우 무조건 NO 처리
        if (columnHidden == undefined) {
            tmpColumn.push(columnEdit);
        }
        else {
            if (columnHidden == false) {
                tmpColumn.push(columnEdit);
            }
            else {
                tmpColumn.push("No");
            }
        }
    }
    else {
        tmpColumn.push("No");
    }
    if (columnType != null && columnType != undefined) {
        tmpColumn.push(columnType);
    }
    else {
        tmpColumn.push("Text");
    }
    if (columnControlId != null && columnControlId != undefined) {
        tmpColumn.push(columnControlId);
    }
    else {
        tmpColumn.push("");
    }
    if (columnSort != null && columnSort != undefined) {
        tmpColumn.push(columnSort);
    }
    else {
        tmpColumn.push(false);
    }
    if (columnHidden == undefined) {
        //IE일경우만 Block 처리(크롬이나 파이어 폭스에서는 깨짐)
        if ($.browser.msie) {
            tmpColumn.push("block");
        }
        else {
            tmpColumn.push("table-cell");
        }
    }
    else {
        if (columnHidden == false) {
            //IE일경우만 Block 처리(크롬이나 파이어 폭스에서는 깨짐)
            if ($.browser.msie) {
                tmpColumn.push("block");
            }
            else {
                tmpColumn.push("table-cell");
            }
        }
        else {
            tmpColumn.push("none");
        }
    }

    this.gridColumn.push(tmpColumn);
}

/*
함수명 : ViewGrid
함수설명 : 그리드 그리기
*/
gGridControrl.prototype.ViewGrid = function (viewDiv) {
    var rtnValue = "";

    try {
        if (this.gridWidth == "") {
            this.gridWidth = "100%";
        }

        if (this.gridHeight == "") {
            this.gridHeight = "300px";
        }

        /**********************************************테이블 설정 시작**********************************************/
        var tmpGridWidth = 0;
        for (var i = 0; i < this.gridColumn.length; i++) {
            tmpGridWidth += parseInt(this.gridColumn[i][2].replace("px", ""));
        }
        /****************************************헤더 설정 시작****************************************/
        rtnValue += "<div style='border:1px solid black;width:" + this.gridWidth + ";'>";
        rtnValue += "<div id='" + this.gridName + "Header' style='border:0px solid black;width:" + this.gridWidth + ";overflow:hidden;'>"
        rtnValue += "<table cellpadding='0' cellspacing='0' border='0' style='table-layout:fixed;width:" + tmpGridWidth + "px;'>";
        rtnValue += "<colgroup>";
        for (var i = 0; i < this.gridColumn.length; i++) {
            rtnValue += "<col width='" + this.gridColumn[i][2] + "' />";
        }
        rtnValue += "<col width='17px' />";
        rtnValue += "</colgroup>";

        rtnValue += "<thead id='" + this.gridName + "BodyHeader'>";
        for (var i = 0; i < this.gridColumn.length; i++) {


            var tmpGridHeaderSortStyle = "";

            //그리드를 정렬하고자 할 경우
            if (this.gridColumn[i][7]) {                
                tmpGridHeaderSortStyle = "cursor:pointer;";
            }
            rtnValue += "<th style='border-right:1px solid black;border-bottom:1px solid black;text-align:center;display:" + this.gridColumn[i][8] + ";" + tmpGridHeaderSortStyle + "'";

            //헤더 스타일 추가
            if (this.gridHeaderStyle != "") {
                rtnValue += " class='" + this.gridHeaderStyle + "'";
            }

            //그리드 정렬하고자 할경우 이벤트, Attribute 추가
            if (this.gridColumn[i][7]) {
                rtnValue += " thSortCheck=\"sort\" onclick=\"fnDNGridSortClick('" + this.gridName + "Body', '" + this.gridColumn[i][0] + "', this)\"";
            }
            //컬럼 아이디 등록
            rtnValue += " thid='" + this.gridColumn[i][0] + "' ";
            rtnValue += ">";
            rtnValue += this.gridColumn[i][1];
            //그리드 정렬하고자 할경우 정렬 이미지 추가
            if (this.gridColumn[i][7]) {
                rtnValue += " <img src='" + gDNGridSortImg + "' border='0'/>";
            }
            rtnValue += "</th>";
        }
        rtnValue += "<th style='border:0px;'>&nbsp;</th>";
        rtnValue += "</thead>";
        rtnValue += "</table>";
        rtnValue += "</div>";
        /****************************************헤더 설정 종료****************************************/
        rtnValue += "<div id='" + this.gridName + "BodyDiv' style='border:0px solid blue;height:" + this.gridHeight + ";width:" + this.gridWidth + ";overflow-y:auto;overflow-x:auto;'>"
        rtnValue += "<table cellpadding='0' cellspacing='0' border='0' id='" + this.gridName + "' style='table-layout:fixed;width:" + tmpGridWidth + "px'>";
        rtnValue += "<colgroup>";
        for (var i = 0; i < this.gridColumn.length; i++) {
            rtnValue += "<col width='" + this.gridColumn[i][2] + "' />";
        }
        rtnValue += "</colgroup>";
        rtnValue += "<tbody id='" + this.gridName + "Body'>";
        rtnValue += "</tbody>";
        rtnValue += "</table>";
        rtnValue += "</div>";
        rtnValue += "</div>";
        /**********************************************테이블 설정 종료**********************************************/
        /**********************************************바디 설정 시작**********************************************/
        rtnValue += "<script id='" + this.gridName + "BodyList' type='text/x-jquery-tmpl'>";
        var tmpRowOverStyle = "";
        if (this.gridRowOverStyle != "") {
            tmpRowOverStyle = "onmouseover=\"fnDNGridMouseOver('" + this.gridRowOverStyle + "','I',this);\" onmouseout=\"fnDNGridMouseOver('" + this.gridRowOverStyle + "','O',this);\"";
        }

        var tmpAttrClickStyle = "";

        //Row 클릭시 스타일 추가
        if (this.gridRowClickStyle != "") {
            tmpAttrClickStyle = "tdclickstyle='" + this.gridRowClickStyle + "'";
        }

        var tmpDoubleClickEvent = "";

        //Row 더블클릭 이벤트 추가
        if (this.gridRowDoubleClickEvent != "") {
            tmpDoubleClickEvent = "ondblclick=\"" + this.gridRowDoubleClickEvent + "(" + this.gridScriptObjectName + ".ActiveRow());\"";
        }

        rtnValue += "<tr style='height:20px;' onclick=\"fnGridRowSelect(this,'" + this.gridName + "TrClass');\" class='" + this.gridName + "TrClass' chkSelect='false' " + tmpRowOverStyle + " " + tmpAttrClickStyle + " " + tmpDoubleClickEvent + " tradd='N' trupdate='N'>";
        for (var i = 0; i < this.gridColumn.length; i++) {
            //넓이 설정
            var tmpTdWidth = "";
            if (this.gridColumn[i][2] != "" && this.gridColumn[i][2] != undefined) {
                tmpTdWidth = "max-width:" + this.gridColumn[i][2] + ";";
            }
            //컨트롤 아이디 설정
            var tmpControl = "";
            if (this.gridColumn[i][6] != "" && this.gridColumn[i][6] != undefined) {
                tmpControl = "tdcontrol='" + this.gridColumn[i][6] + "'";
                //컨트롤 설정이 된 객체는 숨김 처리
                $("#" + this.gridColumn[i][6]).hide();
            }
            //컬럼 Hidden 처리
            var tmpHidden = "display:" + this.gridColumn[i][8] + ";";
            rtnValue += "<td ";
            //정렬처리
            rtnValue += "style='border-right:1px solid black;border-bottom:1px solid black;text-align:" + this.gridColumn[i][3] + ";" + tmpTdWidth + tmpHidden + "' ";
            //수정가능 여부 체크
            rtnValue += "tdedit='" + this.gridColumn[i][4] + "' ";
            //컬럼 타입 체크
            rtnValue += "tdtype='" + this.gridColumn[i][5] + "' ";
            //컨트롤 존재시 등록
            rtnValue += tmpControl + " ";
            //컬럼 아이디 등록
            rtnValue += "tdid='" + this.gridColumn[i][0] + "' ";
            //CellClick
            //Cell 클릭 이벤트 추가
            if (this.gridCellClickEvent != "") {
                rtnValue += "onclick=\"fnGridRowSelect($(this).parent(),'" + this.gridName + "TrClass');" + this.gridCellClickEvent + "(" + this.gridScriptObjectName + ".ActiveRow(),'" + this.gridColumn[i][0] + "')\"";
            }
            rtnValue += ">";

            //체크박스가 아닐경우엔 값 바로 나타냄
            if (this.gridColumn[i][5].toLowerCase() != "checkbox") {
                rtnValue += "<div style='height:20px;text-overflow:ellipsis;overflow:hidden;' onclick=\"fnGridEditDNGrid(this);\">";
                rtnValue += "<nobr>${" + this.gridColumn[i][0].toUpperCase() + "}</nobr>";
                rtnValue += "</div>";
            }

            //컬럼 타입이 Combo이거나 CheckBox 일 경우
            if (this.gridColumn[i][5].toLowerCase() == "combo") {
                rtnValue += "<input type='hidden' value='${" + this.gridColumn[i][0].toUpperCase() + "}'/>";
            }
            else if (this.gridColumn[i][5].toLowerCase() == "checkbox") {
                var tmpCheckBoxEnabled = "";

                //수정가능할 경우 체크박스 활성화
                if (this.gridColumn[i][4].toLowerCase() != "yes") {
                    tmpCheckBoxEnabled = "disabled='disabled'";
                }
                rtnValue += "<input type='checkbox' " + tmpCheckBoxEnabled + " value='' onclick=\"fnGridEditDNGrid(this);\" />";
                rtnValue += "<input type='hidden' value='${" + this.gridColumn[i][0].toUpperCase() + "}'/>";
            }
            rtnValue += "<span></span>";
            rtnValue += "</td>";
        }
        rtnValue += "</tr>";
        rtnValue
        rtnValue += "</script>";
        /**********************************************바디 설정 종료**********************************************/
        /**********************************************스크롤 설정 시작**********************************************/

        $("#" + viewDiv).html(rtnValue);
        //그리드 헤더랑 스크롤 동시 이동처리
        dtGridScroll(this.gridName);

        /**********************************************스크롤 설정 종료**********************************************/
    } catch (e) {
        rtnValue = "그리드 생성 도중 에러가 발생하였습니다.<br/>" + e.Message;
    }
}

//그리드 헤더랑 스크롤 동시 이동처리
function dtGridScroll(gridName) {
    $("#" + gridName + "BodyDiv").scroll(function () {
        $("#" + gridName + "Header").scrollLeft($("#" + gridName + "BodyDiv").scrollLeft());
    });
}

/*
함수명 : AddGrid
함수설명 : 그리드 추가
*/
gGridControrl.prototype.AddGrid = function () {
    //행 추가
    $("#" + this.gridName + "BodyList").tmpl().appendTo("#" + this.gridName + "Body");
    $("tr." + this.gridName + "TrClass").filter("tr:last").attr("tradd", "Y").attr("trupdate","Y");
    fnGridRowSelect($("tr." + this.gridName + "TrClass").filter("tr:last"), this.gridName + "TrClass");
    //스크롤 맨 밑으로 이동
    $("#" + this.gridName + "BodyDiv").scrollTop($("#" + this.gridName + "BodyDiv").prop("scrollHeight"));
}

/*
함수명 : ActiveRow
함수설명 : 활성화된 행 반환
*/
gGridControrl.prototype.ActiveRow = function () {
    var tmpRow = $("tr." + this.gridName + "TrClass[chkSelect=true]")

    //활성화중인 Row가 존재할 경우만 처리
    if ($(tmpRow).length == 1) {
        //컬럼 Key를 통한 객체 반환
        tmpRow.DNCallKey = function (strKey) {
            if (strKey != "" && strKey != undefined) {
                if ($(this).find("td[tdid=" + strKey + "]").length == 1) {
                    var tmpSelColumn = $(this).find("td[tdid=" + strKey + "]");

                    //값설정 및 반환
                    tmpSelColumn.Value = function (tmpVal) {
                        if (tmpVal != undefined) {
                            //셀렉트일 경우
                            if ($(this).attr("tdtype").toLowerCase() == "combo") {
                                //Hidden 값에 Value 추가
                                $(this).find("input:hidden").html(tmpVal);

                                //Select 객체 존재여부 체크
                                var tmpObj = $("#" + $(this).attr("tdcontrol"));
                                if ($(tmpObj).length == 1) {
                                    //입력받은 값이 Select에 존재하는지 체크
                                    if ($(tmpObj).find("option[value=" + tmpVal + "]").length == 1) {
                                        $(this).find("div").html($(tmpObj).find("option[value=" + tmpVal + "]").text());
                                    }
                                    //존재 하지 않을 시 Value 보여붐
                                    else {
                                        $(this).find("div").html(tmpVal);
                                    }
                                }
                            }
                            else if ($(this).attr("tdtype").toLowerCase() == "checkbox") {
                                //Hidden 값에 Value 추가
                                $(this).find("input:hidden").html(tmpVal);

                                var isCheck = false;

                                if (tmpVal == "Y") {
                                    isCheck = true;
                                }

                                var tmpObj = $("#" + $(this).attr("tdcontrol"));

                                if ($.browser.msie) {
                                    $(this).find("input:checkbox").prop("checked", isCheck);
                                }
                                else {
                                    $(this).find("input:checkbox").attr("checked", isCheck);
                                }
                            }
                            else {
                                $(this).find("div").html(fnDNGridAddNobr(tmpVal));
                            }
                        }
                        else {
                            //셀렉트일 경우
                            if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                                return $(this).find("input:hidden").val();
                            }
                            else {
                                return fnDNGridRemoveNobr($(this).find("div").html());
                            }
                        }
                    }

                    //활성화 처리
                    tmpSelColumn.Active = function () {
                        if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                            if ($(tmpSelColumn).attr("tdtype").toLowerCase() == "checkbox") {
                                fnGridEditDNGrid($(tmpSelColumn).find("input:checkbox"));
                            } else {
                                fnGridEditDNGrid($(tmpSelColumn).find("div"));
                            }
                        }
                    }

                    //컬럼 수정 가능/불가능 처리
                    tmpSelColumn.AllowUpdate = function (strUpdate) {
                        if ($.trim(strUpdate).toLowerCase() == "yes") {
                            $(tmpSelColumn).attr("tdedit", "Yes");
                            //체크박스일 경우 체크 가능하도록 변경
                            if ($(tmpSelColumn).attr("tdtype").toLowerCase() == "checkbox") {
                                $(tmpSelColumn).find("input:checkbox").attr("disabled", false);
                            }
                        }
                        else if ($.trim(strUpdate).toLowerCase() == "no") {
                            $(tmpSelColumn).attr("tdedit", "No");
                        }
                    }

                    return tmpSelColumn;
                }
            }
        }

        //해당 Row가 추가인지 체크
        tmpRow.AddYn = function () {
            var rtnValue = false;
            if ($(this).attr("tradd").toLowerCase() == "y") {
                rtnValue = true;
            }
            return rtnValue;
        }

        //해당 Row가 수정인지 체크
        tmpRow.UpdateYn = function () {
            var rtnValue = false;
            if ($(this).attr("trupdate").toLowerCase() == "y") {
                rtnValue = true;
            }
            return rtnValue;
        }

        //해당 Row를 JSON Data로 반환
        tmpRow.ToJson = function () {
            var tmpJsonData = fnGetJsonData(tmpRow);
            return tmpJsonData;
        }
    }

    //선택된 Row가 없을경우
    if ($(tmpRow).length == 0) {
        tmpRow = null;
        alert(gDNGridMsg_Select_Row);
    }

    return tmpRow;
}

/*
함수명 : AddRow
함수설명 : 추가된 행 반환
*/
gGridControrl.prototype.AddRow = function () {
    var tmpRow = $("tr." + this.gridName + "TrClass[tradd=Y]")

    //선택된 Row가 없을경우
    if ($(tmpRow).length == 0) {
        tmpRow = null;
        alert(gDNGridMsg_No_Add_Row);
    }
    else {
        tmpRow.GetRow = function (tmpIdex) {
            if ($(this).filter("tr:eq(" + tmpIdex + ")").length == 1) {
                var tmpDetailRow = $(this).filter("tr:eq(" + tmpIdex + ")");

                //컬럼 Key를 통한 객체 반환
                tmpDetailRow.DNCallKey = function (strKey) {
                    if (strKey != "" && strKey != undefined) {
                        if ($(this).find("td[tdid=" + strKey + "]").length == 1) {
                            var tmpSelColumn = $(this).find("td[tdid=" + strKey + "]");

                            //값설정 및 반환
                            tmpSelColumn.Value = function (tmpVal) {
                                if (tmpVal != undefined) {
                                    //셀렉트일 경우
                                    if ($(this).attr("tdtype").toLowerCase() == "combo") {
                                        //Hidden 값에 Value 추가
                                        $(this).find("input:hidden").html(tmpVal);

                                        //Select 객체 존재여부 체크
                                        var tmpObj = $("#" + $(this).attr("tdcontrol"));
                                        if ($(tmpObj).length == 1) {
                                            //입력받은 값이 Select에 존재하는지 체크
                                            if ($(tmpObj).find("option[value=" + tmpVal + "]").length == 1) {
                                                $(this).find("div").html($(tmpObj).find("option[value=" + tmpVal + "]").text());
                                            }
                                            //존재 하지 않을 시 Value 보여붐
                                            else {
                                                $(this).find("div").html(tmpVal);
                                            }
                                        }
                                    }
                                    else if ($(this).attr("tdtype").toLowerCase() == "checkbox") {
                                        //Hidden 값에 Value 추가
                                        $(this).find("input:hidden").html(tmpVal);

                                        var isCheck = false;

                                        if (tmpVal == "Y") {
                                            isCheck = true;
                                        }

                                        var tmpObj = $("#" + $(this).attr("tdcontrol"));

                                        if ($.browser.msie) {
                                            $(this).find("input:checkbox").prop("checked", isCheck);
                                        }
                                        else {
                                            $(this).find("input:checkbox").attr("checked", isCheck);
                                        }
                                    }
                                    else {
                                        $(this).find("div").html(fnDNGridAddNobr(tmpVal));
                                    }
                                }
                                else {
                                    //셀렉트일 경우
                                    if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                                        return $(this).find("input:hidden").val();
                                    }
                                    else {
                                        return fnDNGridAddNobr($(this).find("div").html());
                                    }
                                }
                            }

                            //활성화 처리
                            tmpSelColumn.Active = function () {
                                if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                    if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                        if ($(tmpSelColumn).attr("tdtype").toLowerCase() == "checkbox") {
                                            fnGridEditDNGrid($(tmpSelColumn).find("input:checkbox"));
                                        } else {
                                            fnGridEditDNGrid($(tmpSelColumn).find("div"));
                                        }
                                    }
                                }
                            }

                            //컬럼 수정 가능/불가능 처리
                            tmpSelColumn.AllowUpdate = function (strUpdate) {
                                if ($.trim(strUpdate).toLowerCase() == "yes") {
                                    $(tmpSelColumn).attr("tdedit", "Yes");
                                }
                                else if ($.trim(strUpdate).toLowerCase() == "no") {
                                    $(tmpSelColumn).attr("tdedit", "No");
                                }
                            }
                            return tmpSelColumn;
                        }
                    }
                }

                //해당 Row가 추가인지 체크
                tmpDetailRow.AddYn = function () {
                    var rtnValue = false;
                    if ($(this).attr("tradd").toLowerCase() == "y") {
                        rtnValue = true;
                    }
                    return rtnValue;
                }

                //해당 Row가 수정인지 체크
                tmpDetailRow.UpdateYn = function () {
                    var rtnValue = false;
                    if ($(this).attr("trupdate").toLowerCase() == "y") {
                        rtnValue = true;
                    }
                    return rtnValue;
                }

                //해당 Row를 JSON Data로 반환
                tmpDetailRow.ToJson = function () {
                    var tmpJsonData = fnGetJsonData(tmpDetailRow);
                    return tmpJsonData;
                }

                return tmpDetailRow;
            }
        }

        //해당 Row를 JSON Data로 반환
        tmpRow.ToJson = function () {
            var tmpJsonData = fnGetJsonData(tmpRow);
            return tmpJsonData;
        }
    }
    return tmpRow;
}

/*
함수명 : AllRow
함수설명 : 전체 행 반환
*/
gGridControrl.prototype.AllRow = function () {
    var tmpRow = $("tr." + this.gridName + "TrClass")

    //선택된 Row가 없을경우
    if ($(tmpRow).length == 0) {
        tmpRow = null;
        alert(gDNGridMsg_No_Row);
    }
    else {
        tmpRow.GetRow = function (tmpIdex) {
            if ($(this).filter("tr:eq(" + tmpIdex + ")").length == 1) {
                var tmpDetailRow = $(this).filter("tr:eq(" + tmpIdex + ")");

                //컬럼 Key를 통한 객체 반환
                tmpDetailRow.DNCallKey = function (strKey) {
                    if (strKey != "" && strKey != undefined) {
                        if ($(this).find("td[tdid=" + strKey + "]").length == 1) {
                            var tmpSelColumn = $(this).find("td[tdid=" + strKey + "]");

                            //값설정 및 반환
                            tmpSelColumn.Value = function (tmpVal) {
                                if (tmpVal != undefined) {
                                    //셀렉트일 경우
                                    if ($(this).attr("tdtype").toLowerCase() == "combo") {
                                        //Hidden 값에 Value 추가
                                        $(this).find("input:hidden").html(tmpVal);

                                        //Select 객체 존재여부 체크
                                        var tmpObj = $("#" + $(this).attr("tdcontrol"));
                                        if ($(tmpObj).length == 1) {
                                            //입력받은 값이 Select에 존재하는지 체크
                                            if ($(tmpObj).find("option[value=" + tmpVal + "]").length == 1) {
                                                $(this).find("div").html($(tmpObj).find("option[value=" + tmpVal + "]").text());
                                            }
                                            //존재 하지 않을 시 Value 보여붐
                                            else {
                                                $(this).find("div").html(tmpVal);
                                            }
                                        }
                                    }
                                    else if ($(this).attr("tdtype").toLowerCase() == "checkbox") {
                                        //Hidden 값에 Value 추가
                                        $(this).find("input:hidden").html(tmpVal);

                                        var isCheck = false;

                                        if (tmpVal == "Y") {
                                            isCheck = true;
                                        }

                                        var tmpObj = $("#" + $(this).attr("tdcontrol"));

                                        if ($.browser.msie) {
                                            $(this).find("input:checkbox").prop("checked", isCheck);
                                        }
                                        else {
                                            $(this).find("input:checkbox").attr("checked", isCheck);
                                        }
                                    }
                                    else {
                                        $(this).find("div").html(fnDNGridAddNobr(tmpVal));
                                    }
                                }
                                else {
                                    //셀렉트일 경우
                                    if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                                        return $(this).find("input:hidden").val();
                                    }
                                    else {
                                        return fnDNGridAddNobr($(this).find("div").html());
                                    }
                                }
                            }

                            //활성화 처리
                            tmpSelColumn.Active = function () {
                                if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                    if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                        if ($(tmpSelColumn).attr("tdtype").toLowerCase() == "checkbox") {
                                            fnGridEditDNGrid($(tmpSelColumn).find("input:checkbox"));
                                        } else {
                                            fnGridEditDNGrid($(tmpSelColumn).find("div"));
                                        }
                                    }
                                }
                            }

                            //컬럼 수정 가능/불가능 처리
                            tmpSelColumn.AllowUpdate = function (strUpdate) {
                                if ($.trim(strUpdate).toLowerCase() == "yes") {
                                    $(tmpSelColumn).attr("tdedit", "Yes");
                                }
                                else if ($.trim(strUpdate).toLowerCase() == "no") {
                                    $(tmpSelColumn).attr("tdedit", "No");
                                }
                            }
                            return tmpSelColumn;
                        }
                    }
                }

                //해당 Row가 추가인지 체크
                tmpDetailRow.AddYn = function () {
                    var rtnValue = false;
                    if ($(this).attr("tradd").toLowerCase() == "y") {
                        rtnValue = true;
                    }
                    return rtnValue;
                }

                //해당 Row가 수정인지 체크
                tmpDetailRow.UpdateYn = function () {
                    var rtnValue = false;
                    if ($(this).attr("trupdate").toLowerCase() == "y") {
                        rtnValue = true;
                    }
                    return rtnValue;
                }

                //해당 Row를 JSON Data로 반환
                tmpDetailRow.ToJson = function () {
                    var tmpJsonData = fnGetJsonData(tmpDetailRow);
                    return tmpJsonData;
                }

                return tmpDetailRow;
            }
        }

        //해당 Row를 JSON Data로 반환
        tmpRow.ToJson = function () {
            var tmpJsonData = fnGetJsonData(tmpRow);
            return tmpJsonData;
        }
    }
    return tmpRow;
}

/*
함수명 : UpdateRow
함수설명 : 수정된 행 반환
*/
gGridControrl.prototype.UpdateRow = function () {
    var tmpRow = $("tr." + this.gridName + "TrClass[trupdate=Y]")

    //선택된 Row가 없을경우
    if ($(tmpRow).length == 0) {
        tmpRow = null;
        alert(gDNGridMsg_No_Update_Row);
    }
    else {
        tmpRow.GetRow = function (tmpIdex) {
            if ($(this).filter("tr:eq(" + tmpIdex + ")").length == 1) {
                var tmpDetailRow = $(this).filter("tr:eq(" + tmpIdex + ")");

                //컬럼 Key를 통한 객체 반환
                tmpDetailRow.DNCallKey = function (strKey) {
                    if (strKey != "" && strKey != undefined) {
                        if ($(this).find("td[tdid=" + strKey + "]").length == 1) {
                            var tmpSelColumn = $(this).find("td[tdid=" + strKey + "]");

                            //값설정 및 반환
                            tmpSelColumn.Value = function (tmpVal) {
                                if (tmpVal != undefined) {
                                    //셀렉트일 경우
                                    if ($(this).attr("tdtype").toLowerCase() == "combo") {
                                        //Hidden 값에 Value 추가
                                        $(this).find("input:hidden").html(tmpVal);

                                        //Select 객체 존재여부 체크
                                        var tmpObj = $("#" + $(this).attr("tdcontrol"));
                                        if ($(tmpObj).length == 1) {
                                            //입력받은 값이 Select에 존재하는지 체크
                                            if ($(tmpObj).find("option[value=" + tmpVal + "]").length == 1) {
                                                $(this).find("div").html($(tmpObj).find("option[value=" + tmpVal + "]").text());
                                            }
                                            //존재 하지 않을 시 Value 보여붐
                                            else {
                                                $(this).find("div").html(tmpVal);
                                            }
                                        }
                                    }
                                    else if ($(this).attr("tdtype").toLowerCase() == "checkbox") {
                                        //Hidden 값에 Value 추가
                                        $(this).find("input:hidden").html(tmpVal);

                                        var isCheck = false;

                                        if (tmpVal == "Y") {
                                            isCheck = true;
                                        }

                                        var tmpObj = $("#" + $(this).attr("tdcontrol"));

                                        if ($.browser.msie) {
                                            $(this).find("input:checkbox").prop("checked", isCheck);
                                        }
                                        else {
                                            $(this).find("input:checkbox").attr("checked", isCheck);
                                        }
                                    }
                                    else {
                                        $(this).find("div").html(fnDNGridAddNobr(tmpVal));
                                    }
                                }
                                else {
                                    //셀렉트일 경우
                                    if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                                        return $(this).find("input:hidden").val();
                                    }
                                    else {
                                        return fnDNGridRemoveNobr($(this).find("div").html());
                                    }
                                }
                            }

                            //활성화 처리
                            tmpSelColumn.Active = function () {
                                if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                    if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                        if ($(tmpSelColumn).attr("tdtype").toLowerCase() == "checkbox") {
                                            fnGridEditDNGrid($(tmpSelColumn).find("input:checkbox"));
                                        } else {
                                            fnGridEditDNGrid($(tmpSelColumn).find("div"));
                                        }
                                    }
                                }
                            }

                            //컬럼 수정 가능/불가능 처리
                            tmpSelColumn.AllowUpdate = function (strUpdate) {
                                if ($.trim(strUpdate).toLowerCase() == "yes") {
                                    $(tmpSelColumn).attr("tdedit", "Yes");
                                }
                                else if ($.trim(strUpdate).toLowerCase() == "no") {
                                    $(tmpSelColumn).attr("tdedit", "No");
                                }
                            }
                            return tmpSelColumn;
                        }
                    }
                }

                //해당 Row가 추가인지 체크
                tmpDetailRow.AddYn = function () {
                    var rtnValue = false;
                    if ($(this).attr("tradd").toLowerCase() == "y") {
                        rtnValue = true;
                    }
                    return rtnValue;
                }

                //해당 Row가 수정인지 체크
                tmpDetailRow.UpdateYn = function () {
                    var rtnValue = false;
                    if ($(this).attr("trupdate").toLowerCase() == "y") {
                        rtnValue = true;
                    }
                    return rtnValue;
                }

                //해당 Row를 JSON Data로 반환
                tmpDetailRow.ToJson = function () {
                    var tmpJsonData = fnGetJsonData(tmpDetailRow);
                    return tmpJsonData;
                }

                return tmpDetailRow;
            }
        }

        //해당 Row를 JSON Data로 반환
        tmpRow.ToJson = function () {
            var tmpJsonData = fnGetJsonData(tmpRow);
            return tmpJsonData;
        }
    }
    return tmpRow;
}

/*
함수명 : GetRow
함수설명 : 선택된 행 반환
*/
gGridControrl.prototype.GetRow = function (tmpIdex) {

    if (tmpIdex == undefined) {
        alert(gDNGridMsg_Select_Row);
    }
    else {
        tmpIdex = tmpIdex - 1;
        if ($("tr." + this.gridName + "TrClass").filter("tr:eq(" + tmpIdex + ")").length == 1) {
            var tmpRow = $("tr." + this.gridName + "TrClass").filter("tr:eq(" + tmpIdex + ")");

            //컬럼 Key를 통한 객체 반환
            tmpRow.DNCallKey = function (strKey) {
                if (strKey != "" && strKey != undefined) {
                    if ($(this).find("td[tdid=" + strKey + "]").length == 1) {
                        var tmpSelColumn = $(this).find("td[tdid=" + strKey + "]");

                        //값설정 및 반환
                        tmpSelColumn.Value = function (tmpVal) {
                            if (tmpVal != undefined) {
                                //셀렉트일 경우
                                if ($(this).attr("tdtype").toLowerCase() == "combo") {
                                    //Hidden 값에 Value 추가
                                    $(this).find("input:hidden").html(tmpVal);

                                    //Select 객체 존재여부 체크
                                    var tmpObj = $("#" + $(this).attr("tdcontrol"));
                                    if ($(tmpObj).length == 1) {
                                        //입력받은 값이 Select에 존재하는지 체크
                                        if ($(tmpObj).find("option[value=" + tmpVal + "]").length == 1) {
                                            $(this).find("div").html($(tmpObj).find("option[value=" + tmpVal + "]").text());
                                        }
                                        //존재 하지 않을 시 Value 보여붐
                                        else {
                                            $(this).find("div").html(tmpVal);
                                        }
                                    }
                                }
                                else if ($(this).attr("tdtype").toLowerCase() == "checkbox") {
                                    //Hidden 값에 Value 추가
                                    $(this).find("input:hidden").html(tmpVal);

                                    var isCheck = false;

                                    if (tmpVal == "Y") {
                                        isCheck = true;
                                    }

                                    var tmpObj = $("#" + $(this).attr("tdcontrol"));

                                    if ($.browser.msie) {
                                        $(this).find("input:checkbox").prop("checked", isCheck);
                                    }
                                    else {
                                        $(this).find("input:checkbox").attr("checked", isCheck);
                                    }
                                }
                                else {
                                    $(this).find("div").html(fnDNGridAddNobr(tmpVal));
                                }
                            }
                            else {
                                //셀렉트일 경우
                                if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                                    return $(this).find("input:hidden").val();
                                }
                                else {
                                    return fnDNGridRemoveNobr($(this).find("div").html());
                                }
                            }
                        }

                        //활성화 처리
                        tmpSelColumn.Active = function () {
                            if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                if ($(tmpSelColumn).attr("tdedit").toLowerCase() == "yes") {
                                    if ($(tmpSelColumn).attr("tdtype").toLowerCase() == "checkbox") {
                                        fnGridEditDNGrid($(tmpSelColumn).find("input:checkbox"));
                                    } else {
                                        fnGridEditDNGrid($(tmpSelColumn).find("div"));
                                    }
                                }
                            }
                        }

                        //컬럼 수정 가능/불가능 처리
                        tmpSelColumn.AllowUpdate = function (strUpdate) {
                            if ($.trim(strUpdate).toLowerCase() == "yes") {
                                $(tmpSelColumn).attr("tdedit", "Yes");
                            }
                            else if ($.trim(strUpdate).toLowerCase() == "no") {
                                $(tmpSelColumn).attr("tdedit", "No");
                            }
                        }

                        return tmpSelColumn;
                    }
                }
            }

            //해당 Row가 추가인지 체크
            tmpRow.AddYn = function () {
                var rtnValue = false;
                if ($(this).attr("tradd").toLowerCase() == "y") {
                    rtnValue = true;
                }
                return rtnValue;
            }

            //해당 Row가 수정인지 체크
            tmpRow.UpdateYn = function () {
                var rtnValue = false;
                if ($(this).attr("trupdate").toLowerCase() == "y") {
                    rtnValue = true;
                }
                return rtnValue;
            }

            //해당 Row를 JSON Data로 반환
            tmpRow.ToJson = function () {
                var tmpJsonData = fnGetJsonData(tmpRow);
                return tmpJsonData;
            }            
            return tmpRow;
        }
        else {
            alert(gDNGridMsg_No_Row);
        }
    }
}

/*
함수명 : GridCount
함수설명 : 그리드 카운트
*/
gGridControrl.prototype.GridCount = function () {
    return $("tr." + this.gridName + "TrClass").length;
}
/**********************************그리드 컬럼추가 함수 시작***************************************/
/*
함수명 : fnGridEditDNGrid
함수설명 : 그리드 에디터
*/
function fnGridEditDNGrid(obj) {
    var tmpTd = $(obj).parent();
    //수정일 경우
    if (tmpTd.attr("tdedit").toLowerCase() == "yes") {
        var tmpValue = $(tmpTd).find("div").html();
        
        //문자일 경우
        if (tmpTd.attr("tdtype").toLowerCase() == "text") {
            $(tmpTd).find("div").hide();
            var tmpObj = fnGridCreateInput();
            $(tmpTd).find("span").html(tmpObj);
            $(tmpTd).find("span").find("input").val(fnDNGridRemoveNobr(tmpValue));
            //Tab Key 이벤트 처리하기 위함
            $(tmpTd).find("span").find("input").keydown(function (e) {
                if (e.keyCode == 9) {
                    var isShift = e.shiftKey;
                    fnTabNextSelect($(tmpTd), isShift);
                    return false;
                }
            });
            //값 변경 시 Update Y로 변경
            $(tmpTd).find("span").find("input").change(function (e) {
                $(tmpTd).parent().attr("trupdate", "Y")
            });
            $(tmpTd).find("span").find("input").focus();
            $(tmpTd).find("span").find("input").focusout(
                function () {
                    $(tmpTd).find("div").html(fnDNGridAddNobr($(tmpTd).find("span").find("input").val()));
                    $(tmpTd).find("div").show();
                    $(tmpTd).find("span").html("");
                }
            );
        }

        //날짜일 경우
        if (tmpTd.attr("tdtype").toLowerCase() == "date") {
            $(tmpTd).find("div").hide();
            var tmpObj = fnGridCreateDate();
            $(tmpTd).find("span").html(tmpObj);
            $(tmpTd).find("span").find("input").val(fnDNGridRemoveNobr(tmpValue));
            //Tab Key 이벤트 처리하기 위함
            $(tmpTd).find("span").find("input").keydown(function (e) {
                if (e.keyCode == 9) {
                    var isShift = e.shiftKey;
                    fnTabNextSelect($(tmpTd), isShift);
                    return false;
                } else {
                    if (e.keyCode != 13 && e.keyCode != 27) {
                        //값 변경 시 Update Y로 변경(직접입력)
                        $(tmpTd).parent().attr("trupdate", "Y")
                    }
                }
            });
            //값 변경 시 Update Y로 변경(달력선택)
            $(tmpTd).find("span").find("input").change(function (e) {
                $(tmpTd).parent().attr("trupdate", "Y");
            });
            $(tmpTd).find("span").find("input").mask("9999-99-99");
            fnSetDatePicker($(tmpTd).find("span").find("input"));
            $(tmpTd).find("span").find("input").focus();
        }

        //숫자일 경우
        if (tmpTd.attr("tdtype").toLowerCase() == "int") {
            $(tmpTd).find("div").hide();
            var tmpObj = fnGridCreateInput();
            $(tmpTd).find("span").html(tmpObj);
            $(tmpTd).find("span").find("input").val(fnDNGridRemoveNobr(tmpValue));
            //Tab Key 이벤트 처리하기 위함
            $(tmpTd).find("span").find("input").keydown(function (e) {
                if (e.keyCode == 9) {
                    var isShift = e.shiftKey;
                    fnTabNextSelect($(tmpTd), isShift);
                    return false;
                }
            });
            //값 변경 시 Update Y로 변경
            $(tmpTd).find("span").find("input").change(function (e) {
                $(tmpTd).parent().attr("trupdate", "Y")
            });
            $(tmpTd).find("span").find("input").numeric();
            $(tmpTd).find("span").find("input").css("ime-mode","disabled");
            $(tmpTd).find("span").find("input").focus();
            $(tmpTd).find("span").find("input").focusout(
                function () {
                    $(tmpTd).find("div").html(fnDNGridAddNobr($(tmpTd).find("span").find("input").val()));
                    $(tmpTd).find("div").show();
                    $(tmpTd).find("span").html("");
                }
            );
        }

        //체크박스일 경우
        if (tmpTd.attr("tdtype").toLowerCase() == "checkbox") {
            $(tmpTd).find("input:checkbox").keydown(function (e) {
                if (e.keyCode == 9) {
                    var isShift = e.shiftKey;
                    fnTabNextSelect($(tmpTd), isShift);
                    return false;
                }
            });

            var tmpChk = "N";

            if ($(tmpTd).find("input:checkbox").is(":checked")) {
                tmpChk = "Y";
            }

            if ($(tmpTd).find("input:hidden").val() != tmpChk) {
                $(tmpTd).parent().attr("trupdate", "Y");
            }
            //$(tmpTd).find("input:checkbox").change(function (e) {
                
            //});

            $(tmpTd).find("input:checkbox").focus();

            if ($(tmpTd).find("input:checkbox").is(":checked")) {
                $(tmpTd).find("input:hidden").val("Y");                
            }
            else {
                $(tmpTd).find("input:hidden").val("N");
            }
        }

        //셀렉트일 경우
        if (tmpTd.attr("tdtype").toLowerCase() == "combo") {
            var tmpControlNm = $(tmpTd).attr("tdcontrol");
            if (tmpControlNm != "" && tmpControlNm != undefined) {
                $(tmpTd).find("div").hide();
                var tmpObj = fnGridCreateSelect(tmpControlNm);
                $(tmpTd).find("span").html(tmpObj);
                //Hidden 값에 있는 항목을 Select 해줌
                $(tmpTd).find("span").find("select").find("option").each(function () {
                    //해당 Value 일 경우 Select 처리
                    if ($(this).attr("value") == $(tmpTd).find("input:hidden").val()) {
                        $(this).attr("selected", "true");
                    }
                });
                //Tab Key 이벤트 처리하기 위함
                $(tmpTd).find("span").find("select").keydown(function (e) {
                    if (e.keyCode == 9) {
                        var isShift = e.shiftKey;
                        fnTabNextSelect($(tmpTd), isShift);
                        return false;
                    }
                });

                //값 변경 시 Update Y로 변경
                $(tmpTd).find("span").find("select").change(function (e) {
                    $(tmpTd).parent().attr("trupdate", "Y")
                });

                $(tmpTd).find("span").find("select").focus();
                $(tmpTd).find("span").find("select").focusout(function () {
                    //선택된 Text값 입력
                    $(tmpTd).find("div").html($(tmpTd).find("span").find("select").find("option:selected").text());
                    $(tmpTd).find("input:hidden").val($(tmpTd).find("span").find("select").find("option:selected").val());
                    $(tmpTd).find("div").show();
                    $(tmpTd).find("span").html("");
                });
            }
        }
    }
}

/*
함수명 : fnGridCreateInput
함수설명 : 그리드 Input 추가
*/
function fnGridCreateInput() {
    var html = "<input type=\"text\" style=\"width:96%;height:16px;border:1px solid;\"/>";
    return html;
}

/*
함수명 : fnGridCreateSelect
함수설명 : 그리드 Select 추가
*/
function fnGridCreateSelect(tmpObj) {
    var html = "<select style='width:98%;height:18px;border:1px solid'>";
    $("#" + tmpObj + " option").each(function () {
        html += "<option value='" + $(this).val() + "'>" + $(this).text() + "</option>";
    });
    return html;
}

/*
함수명 : fnGridCreateDate
함수설명 : 그리드 날짜 Input 추가
*/
function fnGridCreateDate() {
    var html;
    html = "<input type=\"text\" class=\"dateinput\" style=\"width:96%;height:16px;border:1px solid;\" mask=\"date\"/>";
    return html;
}

/*
함수명 : fnSetDatePicker
함수설명 : 그리드 날짜 달력선택가능토록 변경
*/
function fnSetDatePicker(obj) {
    obj.datepicker({
        dateFormat: 'yy-mm-dd',
        onClose: function (date) {
            if (date.ReplaceAll("_", "").ReplaceAll("-", "").length != 8) {
                date = "";
            }
            else {
                //날짜 형식이 올바르지 않을경우 빈값 반환
                if (!fnValidDate(date)) {
                    date = "";
                }
            }
            $(obj).parent().parent().find("div").html(fnDNGridAddNobr(date));
            $(obj).parent().parent().find("div").show();
            $(obj).parent().parent().find("span").html("");
        }
    });
}

/*
함수명 : fnGridRowSelect
함수설명 : 그리드 선택여부 체크
*/
function fnGridRowSelect(obj, trClassName) {
    $("tr." + trClassName).attr("chkSelect", "false");
    $(obj).attr("chkSelect", "true");

    var tmpClickClass = $(obj).attr("tdclickstyle");
    if (tmpClickClass != "") {
        $("tr." + trClassName).removeClass(tmpClickClass);
        $(obj).addClass(tmpClickClass);
    }
}

/*
함수명 : ReplaceAll
*/
String.prototype.ReplaceAll = function (source, target) {
    //정규식 선언
    var regEx = new RegExp(source, "g");
    var rtnValue = this.replace(regEx, "");
    return rtnValue;
}

/*
함수명 : fnValidDate
함수설명 : 유효한 날짜인지 체크(yyyy-MM-dd)
*/
function fnValidDate(tmpDate) {
    var strYear = parseInt(tmpDate.substr(0, 4), 10);
    var strMonth = parseInt(tmpDate.substr(5, 2), 10) - 1;
    var strDay = parseInt(tmpDate.substr(8, 2), 10);

    var tmpDt = new Date(strYear, strMonth, strDay);

    if (tmpDt.getFullYear() == strYear && tmpDt.getMonth() == strMonth && tmpDt.getDate() == strDay) {
        return true;
    }
    else {
        return false;
    }
}

/*
함수명 : fnTabNextSelect(해당 TD, 쉬프트키여부)
함수설명 : 탭 이벤트 시 다음 입력창 선택
*/
function fnTabNextSelect(obj, isShift) {
    //ID값을 통한 현재 INDEX 구하기
    var tmpIndex = $(obj).parent().find("td").index($(obj));

    var nextObj = null;

    $(obj).parent().find("td").each(function (i) {
        //Shift Key를 동시에 클릭 하였을 경우
        if (isShift) {
            if (tmpIndex > i) {
                //업데이트 가능한 컬럼인지 체크
                if ($(this).attr("tdedit").toLowerCase() == "yes") {                    
                    nextObj = this;
                }
            }
            else {
                return false;
            }
        }
        else {
            if (tmpIndex < i) {
                //업데이트 가능한 컬럼인지 체크
                if ($(this).attr("tdedit").toLowerCase() == "yes") {
                    nextObj = this;
                    return false;
                }
            }
        }
    });

    //다음번 컬럼이 존재할 경우 포커스 이동 및 컬럼 활성화
    if (nextObj != null) {
        //SetTimeout focus 처리(FF, Chrome focus 에러나기 때문)
        //setTimeout(function () { fnGridEditDNGrid($(nextObj).find("div")); }, 0);        
        //체크박스 일 경우
        if ($(nextObj).attr("tdtype").toLowerCase() == "checkbox") {
            setTimeout(function () { fnGridEditDNGrid($(nextObj).find("input:checkbox")); }, 100);
        } else {
            setTimeout(function () { fnGridEditDNGrid($(nextObj).find("div")); }, 100);
        }
    }
    //동일한 행에 더이상 이동 공간이 없을 경우 다음이나 이전 행으로 이동
    else {
        //부모 클래스명 구함
        var tmpParentClass = $(obj).parent().attr("class");
        
        //부모클래스 명 중에서 공통으로 적용된 gridClass를 적용하기 위함
        tmpParentClass = tmpParentClass.split(" ")[0];

        //부모 객체 구함
        var tmpParentObj = $(obj).parent().parent().find("tr." + tmpParentClass);

        //부모 객체에서 자신의 Index 구함
        var tmpParentIndex = $(tmpParentObj).index($(obj).parent());

        //이동할 Index
        var tmpMoveIndex = tmpParentIndex;

        if (isShift) {
            //첫행보다 클 경우
            if (tmpParentIndex > 0) {
                tmpMoveIndex = tmpMoveIndex - 1;
            }
        } else {
            //마지막 행보다 작을 경우
            if (tmpParentIndex < $(tmpParentObj).length - 1) {
                tmpMoveIndex = tmpMoveIndex + 1;
            }
        }

        if (tmpParentIndex != tmpMoveIndex) {
            var tmpMoveTrObj = null;
            $(tmpParentObj).filter(":eq(" + tmpMoveIndex + ")").find("td").each(function () {
                if ($(this).attr("tdedit").toLowerCase() == "yes") {
                    tmpMoveTrObj = $(this);
                    //Shift키일 경우는 마지막꺼 호출해야하기 때문
                    if (!isShift) {
                        return false;
                    }
                }
            });

            if (tmpMoveTrObj != null) {
                var tmpParentClass = $(obj).parent().attr("class");
                tmpParentClass = tmpParentClass.split(" ")[0];
                //체크박스 일 경우 처리
                if ($(tmpMoveTrObj).attr("tdtype").toLowerCase() == "checkbox") {
                    setTimeout(function () { fnGridRowSelect($(tmpMoveTrObj).parent(), tmpParentClass); fnGridEditDNGrid($(tmpMoveTrObj).find("input:checkbox")); }, 100);
                } else {
                    setTimeout(function () { fnGridRowSelect($(tmpMoveTrObj).parent(), tmpParentClass); fnGridEditDNGrid($(tmpMoveTrObj).find("div")); }, 100);
                }
            }
        }
        else {
            if (isShift) {
                //체크박스 일 경우 처리
                if ($(obj).attr("tdtype").toLowerCase() == "checkbox") {
                    setTimeout(function () { fnGridEditDNGrid($(obj).find("input:checkbox")); }, 0);
                } else {
                    setTimeout(function () { fnGridEditDNGrid($(obj).find("div")); }, 0);
                }
            }
            return false;
        }
    }
}

/*
함수명 : fnGetJsonData(해당 TR)
함수설명 : 해당 Row 값을 JSON으로 반환
*/
function fnGetJsonData(obj) {
    var rtnValue = "";
    if ($(obj).length == 1) {
        var tmpLength = $(obj).find("td").length;
        rtnValue = "[{";
        $(obj).find("td").each(function (i) {
            rtnValue += "\"" + $(this).attr("tdid") + "\":";
            //Select나 CheckBox 일경우 hidden 속성 가져옴
            if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                rtnValue += "\"" + $(this).find("input:hidden").val() + "\"";
            } else {
                rtnValue += "\"" + fnDNGridJsonDataCheck(fnDNGridRemoveNobr($(this).find("div").html())) + "\"";
            }

            if (tmpLength > i + 1) {
                rtnValue += ",";
            }
        });
        rtnValue += "}]";
    }
    else {
        rtnValue += "[";
        for (var i = 0; i < $(obj).length; i++) {
            var tmpRow = $(obj).filter("tr:eq(" + i + ")");
            var tmpLength = $(tmpRow).find("td").length;
            if (i == 0) {
                rtnValue += "{";
            } else {
                rtnValue += ",{";
            }
            $(tmpRow).find("td").each(function (i) {
                rtnValue += "\"" + $(this).attr("tdid") + "\":";
                //Select 일경우 hidden 속성 가져옴
                if ($(this).attr("tdtype").toLowerCase() == "combo" || $(this).attr("tdtype").toLowerCase() == "checkbox") {
                    rtnValue += "\"" + $(this).find("input:hidden").val() + "\"";
                } else {
                    rtnValue += "\"" + fnDNGridJsonDataCheck(fnDNGridRemoveNobr($(this).find("div").html())) + "\"";
                }

                if (tmpLength > i + 1) {
                    rtnValue += ",";
                }
            });
            rtnValue += "}";
        }
        rtnValue += "]";
    }
    return rtnValue;
}

/*
함수명 : fnDNGridRowSuccess(Row)
함수설명 : Row 데이터 전송 성공시 처리
*/
function fnDNGridRowSuccess(tmpRow) {
    if (tmpRow == null) {
        alert("해당 Row가 존재하지 않습니다.");
    }
    else {
        tmpRow.attr("tradd", "N");
        tmpRow.attr("trupdate", "N");
        tmpRow.css("color", "blue");
    }
}

/*
함수명 : fnDNGridRowFailed(Row)
함수설명 : Row 데이터 전송 실패시 처리
*/
function fnDNGridRowFailed(tmpRow) {
    if (tmpRow == null) {
        alert("해당 Row가 존재하지 않습니다.");
    }
    else {
        tmpRow.css("color", "red");
    }
}

/*
함수명 : fnRowDelete(Row)
함수설명 : Row 데이터 삭제
*/
function fnDNGridRowDelete(tmpRow) {
    if (tmpRow == null) {
        alert("해당 Row가 존재하지 않습니다.");
    }
    else {
        tmpRow.remove();
    }
}

/*
함수명 : fnDNGridMouseOver(클래스명,인아웃,해당 TR)
함수설명 : 마우스 오버시 스타일 적용
*/
function fnDNGridMouseOver(tmpClass, strStatus, obj) {
    if (strStatus == "I") {
        $(obj).addClass(tmpClass);
    } else {
        $(obj).removeClass(tmpClass);
    }
}

/*
함수명 : fnDNGridCheckBoxChecked(objRow, Cell Name,true)
함수설명 : 체크박스 체크 및 해제 처리
*/
function fnDNGridCheckBoxChecked(objRow, objCellId, isCheck) {
    if ($.browser.msie) {
        objRow.find("td[tdid=" + objCellId + "]").find("input:checkbox").prop("checked", isCheck);
    }
    else {
        objRow.find("td[tdid=" + objCellId + "]").find("input:checkbox").attr("checked", isCheck);
    }
}

/*
함수명 : fnDNGridAllChecked(gridControl, objCellId,isCheck)
함수설명 : 그리드 내 체크박스 전체 체크 및 해제
*/
function fnDNGridAllChecked(gridControl, objCellId, isCheck) {
    for (var i = 1; i <= gridControl.GridCount(); i++) {
        var tmpRow = gridControl.GetRow(i);
        fnDNGridCheckBoxChecked(tmpRow, objCellId, isCheck);
    }
}

/*
함수명 : fnDNGridHeaderSortDefault(tmpGridName)
함수설명 : 그리드 헤더 SORT 초기화
*/
function fnDNGridHeaderSortDefault(tmpGridName) {
    $("#" + tmpGridName + "BodyHeader").find("th").each(function () {
        //정렬가능한 헤더일 경우 이미지 초기화
        if ($(this).attr("thSortCheck") != null && $(this).attr("thSortCheck") != undefined) {
            //현재 Sort 상태값
            var tmpSort = $(this).attr("thSortCheck").toLowerCase();
            if (tmpSort == "sort" || tmpSort == "asort" || tmpSort == "dsort") {
                $(this).attr("thSortCheck", "sort");
                //검색 체크 기본 이미지로 변경
                $(this).find("img").attr("src", gDNGridSortImg)
            }
        }
    });
}

/*
함수명 : fnDNGridSortClick(gridBody, cellID, tdObj)
함수설명 : 그리드 헤더 클릭을 통한 SORT
*/
function fnDNGridSortClick(gridBody, cellID, tdObj) {
    //tr에 있는 th 돌기
    $(tdObj).parent().find("th").each(function () {
        //정렬가능한 헤더일 경우 이미지 초기화
        if ($(this).attr("thSortCheck") != null && $(this).attr("thSortCheck") != undefined) {
            //현재 Sort 상태값
            var tmpSort = $(this).attr("thSortCheck").toLowerCase();
            if (tmpSort == "sort" || tmpSort == "asort" || tmpSort == "dsort") {
                $(this).attr("thSortCheck", "sort");
                //검색 체크 기본 이미지로 변경
                $(this).find("img").attr("src", gDNGridSortImg)
            }

            if ($(this).attr("thid") == cellID) {
                //sort attribute 값이 sort 일 경우 asort로 변경
                if (tmpSort == "sort") {
                    $(this).attr("thSortCheck", "asort");
                    $(this).find("img").attr("src", gDNGridASortImg)
                    fnDNGridSort(gridBody, cellID, "asc");
                }
                //sort attribute 값이 asort 일 경우 dsort로 변경
                if (tmpSort == "asort") {
                    $(this).attr("thSortCheck", "dsort");
                    $(this).find("img").attr("src", gDNGridDSortImg)
                    fnDNGridSort(gridBody, cellID, "desc");
                }
                //sort attribute 값이 dsort 일 경우 asort로 변경
                if (tmpSort == "dsort") {
                    $(this).attr("thSortCheck", "asort");
                    $(this).find("img").attr("src", gDNGridASortImg)
                    fnDNGridSort(gridBody, cellID, "asc");
                }
            }
        }
    });
}

/*
함수명 : fnDNGridSort(gridBody, cellID, sortStatus)
함수설명 : 그리드 SORT
*/
function fnDNGridSort(gridBody, cellID, sortStatus) {
    var chkSort = 0;
    
    if (sortStatus == "asc") {
        chkSort = 1;
    }
    else {
        chkSort = -1;
    }

    //정렬해야할 행 가져오기
    var sortRows = $("#" + gridBody).find("tr").get();

    //정렬 처리
    var tmpIdx = 1;

    //그리드 값 전부 가져옴
    sortRows.sort(function (nextRow, nowRow) {
        var rtnValue = 0;

        var nextValue = fnDNGridTdForValue($(nextRow).find("td[tdid=" + cellID + "]"));
        var nowVale = fnDNGridTdForValue($(nowRow).find("td[tdid=" + cellID + "]"));
        if (nextValue < nowVale) rtnValue = -chkSort;
        if (nextValue > nowVale) rtnValue = chkSort;
        
        tmpIdx++;
        return rtnValue;
    });

    //정렬 항목 적용
    $.each(sortRows, function (idx, tmpRow) {
        $("#" + gridBody).append(tmpRow)
    });
}

/*
함수명 : fnDNGridTdForValue(objTd)
함수설명 : TD를 통한 값 반환
*/
function fnDNGridTdForValue(objTd) {
    //셀렉트일 경우
    if ($(objTd).attr("tdtype").toLowerCase() == "combo") {
        return $(objTd).find("input:hidden").val();
    } else if ($(objTd).attr("tdtype").toLowerCase() == "checkbox") {
        if ($(objTd).find("input:hidden").val() == "") {
            return "N";
        }
        else {
            return $(objTd).find("input:hidden").val();
        }
    }
    else {
        return fnDNGridRemoveNobr($(objTd).find("div").html());
    }
}

function fnDNGridRemoveNobr(strText) {
    return strText.replace("<nobr>", "").replace("</nobr>", "");
}

function fnDNGridAddNobr(strText) {
    return "<nobr>" + strText + "</nobr>";
}

//JSON Data 체크
function fnDNGridJsonDataCheck(strJson) {
    var rtnValue = strJson;

    //쌍따옴표 처리
    rtnValue = rtnValue.replace(/\"/g, '&#34;');
    //역슬래쉬 처리
    rtnValue = rtnValue.replace(/\\/g, '&#92;');
    return rtnValue;
}

//엑셀 다운로드
(function ($) {
    $.fn.excel = function (options) {
        //iframe 제거
        $('#__excel__').remove();
        //form 제거
        $('#excelForm').remove();

        var feature = 'width="{0}" height="{1}"';

        if (options.debug == true) {
            feature = feature.format('800', '500');
        }
        else {
            feature = feature.format('0', '0');
            feature += "style='display:none;'";
        }

        // iframe 추가
        $('body').append('<iframe id="__excel__" name="__excel__" {0}></iframe>'.format(feature));
        
        var frm = window.document.createElement("FORM");
        frm.setAttribute("style", "display:none");
        frm.setAttribute("id", "excelForm");
        frm.setAttribute("method", "post");
        frm.setAttribute("target", "__excel__");
        frm.setAttribute("action", gDNGridExcelDownFile);
        window.document.body.appendChild(frm);

        var obj1 = window.document.createElement("input");
        obj1.setAttribute("type", "hidden");
        obj1.setAttribute("id", "TableName");
        obj1.setAttribute("name", "TableName");
        obj1.value = options.tableName;
        frm.appendChild(obj1);

         var obj2 = window.document.createElement("input");
        obj2.setAttribute("type", "hidden");
        obj2.setAttribute("id", "dataToDisplay");
        obj2.setAttribute("name", "dataToDisplay");
        obj2.value = $('<div>').append($(this).eq(0).clone()).html();
        frm.appendChild(obj2);

        frm.submit();
    };
})(jQuery);