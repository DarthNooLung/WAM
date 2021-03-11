//타임스탬프로 시분초 구하기 그리고 아래에 넣기
var nowTS = new Date();
document.write("<script type='text/javascript' src='/Include/Js/jquery-latest.js?NowTime=" + String(nowTS.getTime()) + "'></script>");
var WaitAMinute = new Object();

//ActionId
WaitAMinute.ActionId = "";
//Action 경로
WaitAMinute.URL = "http://localhost:216";
//호출 본체 함수
//WaitAMinute.CallBodyFunction = null;
//카운팅 레이어 크기
WaitAMinute.MainLayerX = 300;
WaitAMinute.MainLayerY = 200;

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

    var mBody = document;

    if(mBody != null){
        //마스크 프레임 추가
        if(mBody.getElementById("wamMaskFrame") == null){
            var cFrameLayer = mBody.createElement("iframe");
            cFrameLayer.id = "wamMaskFrame";
            cFrameLayer.style.position = "absolute";
            cFrameLayer.style.width = "100%";
            cFrameLayer.style.height = "100%";
            cFrameLayer.style.border = "0px";
            cFrameLayer.style.top = "0px";
            cFrameLayer.style.left = "0px";
            cFrameLayer.style.backgroundColor = "black";
            cFrameLayer.style.opacity = 0.2;
            cFrameLayer.style.display = "none";
            cFrameLayer.style.zIndex = 9999;
            cFrameLayer.src = "about:blank";
            mBody.getElementsByTagName("body")[0].appendChild(cFrameLayer);
        }
        
        if(mBody.getElementById("wamMainFrame") == null){
            var cFrameLayer = mBody.createElement("iframe");
            cFrameLayer.id = "wamMainFrame";
            cFrameLayer.style.position = "absolute";
            cFrameLayer.style.width = String(WaitAMinute.MainLayerX) + "px";
            cFrameLayer.style.height = String(WaitAMinute.MainLayerY) + "px";
            cFrameLayer.style.border = "0px";
            cFrameLayer.style.top = "0px";
            cFrameLayer.style.left = "0px";
            cFrameLayer.style.backgroundColor = "black";
            cFrameLayer.style.display = "none";
            cFrameLayer.style.zIndex = 99999;
            cFrameLayer.src = "about:blank";
            mBody.getElementsByTagName("body")[0].appendChild(cFrameLayer);
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
        url: WaitAMinute.URL + "/wams?ActionId=" + WaitAMinute.ActionId,
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
        url: WaitAMinute.URL + "/wami?ActionId=" + WaitAMinute.ActionId,
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
        url: WaitAMinute.URL + "/wamf?ActionId=1",
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
            if(document.getElementById("wamMaskFrame") != null)
            {
                if(document.getElementById("wamMaskFrame").style.display == "none") {
                    //스크롤값 계산해서 top left 수정
                    document.getElementById("wamMaskFrame").style.top = String(window.scrollY || window.pageYOffset) + "px";
                    document.getElementById("wamMaskFrame").style.left = String(window.scrollX || window.pageXOffset) + "px";
                    document.getElementById("wamMaskFrame").style.display = "block";
                }
            }

            if(document.getElementById("wamMainFrame") != null)
            {
                if(document.getElementById("wamMainFrame").style.display == "none") {
                    //스크롤값 계산해서 top left 수정
                    var popupY= (window.innerHeight / 2) - (WaitAMinute.MainLayerY / 2);
                    var popupX = (window.innerWidth / 2) - (WaitAMinute.MainLayerX / 2);
                    document.getElementById("wamMainFrame").style.top = String((window.scrollY || window.pageYOffset) + popupY) + "px";
                    document.getElementById("wamMainFrame").style.left = String((window.scrollX || window.pageXOffset) + popupX) + "px";
                    document.getElementById("wamMainFrame").style.display = "block";
                }
            }
            setTimeout(wamWait, 1000);
        }
        else if (data.RtnType == "PASS") {
            $("#tdTotal").text(String(iTot));
            $("#tdBefore").text(String(iBef));
            $("#tdAfter").text(String(iAft));
            $("#divWAM").hide();
            if(document.getElementById("wamMaskFrame") != null)
            {
                document.getElementById("wamMaskFrame").style.display = "none";
            }

            if(document.getElementById("wamMainFrame") != null)
            {
                document.getElementById("wamMainFrame").style.display = "none";
            }

            setTimeout(function(){
                WaitAMinute.CallBodyFunction();
                wamFinish();    
            }, 500);
            
        }
        else if (data.RtnType == "DONE") {                
            $("#btnFInish").hide();
            $("#btnStart").show();
        }
    }
}