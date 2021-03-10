//타임스탬프로 시분초 구하기 그리고 아래에 넣기
var nowTS = new Date();
document.write("<script type='text/javascript' src='/Include/Js/jquery-latest.js?NowTime=" + String(nowTS.getTime()) + "'></script>");
var WaitAMinute = new Object();

//ActionId
WaitAMinute.ActionId = "";
//호출 본체 함수
//WaitAMinute.CallBodyFunction = null;

function WAM_GO(o, b)
{
    //호출 본체가 있는지 체크
    if(b == undefined)
    {
        return false;
    }
    else {
        //호출하는게 함수 일 경우
        if(typeof b == "function") {
            WaitAMinute.CallBodyFunction = b;
        }
    }

    //설정값이 있는지 체크
    if(o == undefined)
    {
        return false;
    }
    else
    {
        if(typeof o != "object") {
            return false;
        }
        else {
            WaitAMinute.ActionId = o.action_id;

            wamStart();
        }
    }
}

function wamStart() {
    $("#btnStart").hide();
    $.ajax({
        url: "http://localhost:216/wams?ActionId=" + WaitAMinute.ActionId,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "wamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}

function wamWait() {
    $.ajax({
        url: "http://localhost:216/wami?ActionId=" + WaitAMinute.ActionId,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "wamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}

function wamFinish() {
    $.ajax({
        url: "http://localhost:216/wamf?ActionId=1",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "wamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}

function wamResult(data) {
    if(!data.isError) {
        var iTotCnt = Number(data.TotCnt);
        var iNowOrd = Number(data.NowOrd);
        var iMyOrd = Number(data.MyOrd);

        //전체인원 구하기
        var iTot = iTotCnt - iNowOrd;
        //내 앞 구하기
        var iBef = iMyOrd - iNowOrd - 1;
        //내 뒤 구하기
        var iAft = iTot - iBef - 1;

        //대기값 받아 왔을 경우
        if (data.RtnType == "WAIT") {
            $("#tdTotal").text(String(iTot));
            $("#tdBefore").text(String(iBef));
            $("#tdAfter").text(String(iAft));
            $("#divWAM").show();
            setTimeout(wamWait, 1000);
        }
        else if (data.RtnType == "PASS") {
            $("#tdTotal").text(String(iTot));
            $("#tdBefore").text(String(iBef));
            $("#tdAfter").text(String(iAft));
            $("#divWAM").hide();
            WaitAMinute.CallBodyFunction();
            wamFinish();
        }
        else if (data.RtnType == "DONE") {                
            $("#btnFInish").hide();
            $("#btnStart").show();
            //alert("끝");
        }
    }
}