//타임스탬프로 시분초 구하기 그리고 아래에 넣기
var nowTS = new Date();
document.write("<script type='text/javascript' src='/Include/Js/jquery-latest.js?NowTime=" + String(nowTS.getTime()) + "'></script>");
var WaitAMinute = new Object();

//ActionId
WaitAMinute.ActionId = "";
//Action 경로
WaitAMinute.URL = "http://localhost:216";
//레이어 HTML
//WaitAMinute.WamMainFrameBody = "<div style='width: 298; height: 198;text-align:center;border: 0px solid red;'><br/><table style='margin-left: auto; margin-right: auto;width: 250px;' border='1' cellpadding='0' cellspacing='0'><colgroup><col width='33%'/><col width='33%'/><col width='*'/></colgroup><tr><th>전체</th><th>앞</th><th>뒤</th></tr><tr><td id='WamLayerTotalCnt' style='text-align:center;'>{WamLayerTotalCnt}</td><td id='WamLayerBeforeCnt' style='text-align:center;'>{WamLayerBeforeCnt}</td><td id='WamLayerAfterCnt' style='text-align:center;'>{WamLayerAfterCnt}</td></tr></table><table style='margin-left: auto; margin-right: auto;width: 250px;margin-top:10px;' border='0' cellpadding='0' cellspacing='0'><tr><td style='border:1px solid black;height:15px;'><div style='background-color:#e4e4e4;width:{WamLayerPercent}%;font-size:2px;'>&nbsp;</div></td></tr></table></div>";
WaitAMinute.WamMainFrameBody = "<div style='width: 298; height: 198;text-align:center;border: 0px solid red;'><br/><table style='margin-left: auto; margin-right: auto;width: 250px;' border='1' cellpadding='0' cellspacing='0'><colgroup><col width='33%'/><col width='33%'/><col width='*'/></colgroup><tr><th>전체</th><th>앞</th><th>뒤</th></tr><tr><td id='WamLayerTotalCnt' style='text-align:center;'>{WamLayerTotalCnt}</td><td id='WamLayerBeforeCnt' style='text-align:center;'>{WamLayerBeforeCnt}</td><td id='WamLayerAfterCnt' style='text-align:center;'>{WamLayerAfterCnt}</td></tr></table></div>";
//호출 타입
WaitAMinute.CallBodyType = null;
//호출 본체 함수
WaitAMinute.CallBodyFunction = null;
//호출 링크
WaitAMinute.CallBodyLink = null;
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
            WaitAMinute.CallBodyType = "FUNCTION";
            WaitAMinute.CallBodyFunction = b;
        }
        else if(typeof b == "string") {
            WaitAMinute.CallBodyType = "LINK";
            WaitAMinute.CallBodyLink = b;
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
            //cFrameLayer.style.backgroundColor = "black";
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

function wamWait(strWamKey) {
    $.ajax({
        url: WaitAMinute.URL + "/wami?ActionId=" + WaitAMinute.ActionId + "&WamKey=" + strWamKey,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        jsonpCallback: "wamResult",
        error: function (request, error) {
            alert("message:" + request.responseText);
        }
    });
}

function wamFinish(strWamKey) {
    $.ajax({
        url: WaitAMinute.URL + "/wamf?ActionId=" + WaitAMinute.ActionId + "&WamKey=" + strWamKey,
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
                var iWmf;
                if (document.getElementById("wamMainFrame").contentWindow) {
                    iWmf = document.getElementById("wamMainFrame").contentWindow.document.getElementsByTagName("body")[0];
                } else if (document.getElementById("wamMainFrame").frames) {
                    iWmf = document.getElementById("wamMainFrame").frames.document.getElementsByTagName("body")[0];
                }
                iWmf.style.overflow = "hidden";
                iWmf.style.backgroundColor = "white";
                iWmf.style.border = "1px solid black";
                iWmf.style.margin = "0px";

                var strWmfBody = WaitAMinute.WamMainFrameBody;
                strWmfBody = strWmfBody.replace("{WamLayerTotalCnt}", String(iTot));
                strWmfBody = strWmfBody.replace("{WamLayerBeforeCnt}", String(iBef));
                strWmfBody = strWmfBody.replace("{WamLayerAfterCnt}", String(iAft));
                if(iTot > 0) {
                    strWmfBody = strWmfBody.replace("{WamLayerPercent}", String(Math.floor(iBef / iTot * 100)));
                }
                else {
                    strWmfBody = strWmfBody.replace("{WamLayerPercent}", "0");
                }
                iWmf.innerHTML = strWmfBody;
                
                if(document.getElementById("wamMainFrame").style.display == "none") {
                    //스크롤값 계산해서 top left 수정
                    var popupY= (window.innerHeight / 2) - (WaitAMinute.MainLayerY / 2);
                    var popupX = (window.innerWidth / 2) - (WaitAMinute.MainLayerX / 2);
                    document.getElementById("wamMainFrame").style.top = String((window.scrollY || window.pageYOffset) + popupY) + "px";
                    document.getElementById("wamMainFrame").style.left = String((window.scrollX || window.pageXOffset) + popupX) + "px";
                    document.getElementById("wamMainFrame").style.display = "block";
                }
            }
            setTimeout(function(){
                wamWait(data.WamKey);
            }, 1000);
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
                //함수일 경우
                if(WaitAMinute.CallBodyType == "FUNCTION"){
                    WaitAMinute.CallBodyFunction();
                    wamFinish(data.WamKey);
                }
                //링크일 경우
                else if(WaitAMinute.CallBodyType == "LINK"){
                    if(WaitAMinute.CallBodyLink != null && WaitAMinute.CallBodyLink != "") {
                        window.addEventListener('beforeunload', function() {
                            //해당 Action의 시간을 제외처리
                            console.log("asdfasdfasdf");
                        });
                        self.location.href = WaitAMinute.CallBodyLink;
                    }
                }
            }, 500);
            
        }
        else if (data.RtnType == "DONE") {                
        }
    }
    else {
        alert(data.Msg);
    }
}

window.addEventListener('unload', function(event) {
    console.log('I am the 3rd one.');
  });