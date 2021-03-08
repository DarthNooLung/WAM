function fnStart() {
    $("#btnStart").hide();
    $.ajax({
        url: "http://localhost:216/wams?ActionId=1",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "fnWamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}

function fnWait() {
    $.ajax({
        url: "http://localhost:216/wami?ActionId=1",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "fnWamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}

function fnWamResult(data) {
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
            setTimeout(fnWait, 1000);
        }
        else if (data.RtnType == "PASS") {
            $("#tdTotal").text(String(iTot));
            $("#tdBefore").text(String(iBef));
            $("#tdAfter").text(String(iAft));
            $("#divWAM").hide();
            $("#btnFInish").show();
        }
        else if (data.RtnType == "DONE") {                
            $("#btnFInish").hide();
            $("#btnStart").show();
            //alert("끝");
        }
    }
}

function fnFinish() {
    $.ajax({
        url: "http://localhost:216/wamf?ActionId=1",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "fnWamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}