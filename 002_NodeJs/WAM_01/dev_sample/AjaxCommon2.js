(function ($) {
	$.simpledropdown = function (selector) {

		$(selector).children("ul").addClass("dropdown");
		$("ul.dropdown>li:first-child").addClass("selected");
		$("ul.dropdown>li").not(".dropdown>li:first-child").addClass("drop");

		$("ul.dropdown").click(function () {
			var subitems = $(this).find(".drop ul li");
			var selecteditem = $(this).find(".selected");
			subitems.slideToggle("fast", function () {

				subitems.click(function () {
					var selection = $(this).text();
					selecteditem.text(selection).fadeOut(5, function () {
						if (jQuery.browser.msie) {
							$(this).fadeIn(100);
						} else {
							$(this).fadeIn(400);
						}
					});
				});
			});
		});

		$(selector).show();
	};
})(jQuery);

// 사용자 언어: User.master에 정의되어 있음
var __languageCode = '';
// 루트 경로: User.master에 정의되어 있음
var __rootPath = '';
// 검색결과 없음 리소스. User.master에 정의되어 있음
var __noRecordMessage = '';

var __target = 'modal';
var __isModal = false;
var __containerID = '#Wrapper';
var __maskStack = new Array();

var __popupFormID = null;

var _pageSize = 10;

$(document).ready(
	function () {
	    // image globalization
	    $('img.needTranslation').each(function (i) {
	        replaceTranslatedImage(this, 'src');
	        replaceTranslatedImage(this, 'oversrc');
	    });

	    try {
	        //$("#floatingMenu").floatingPosition(1103, 0);

	        if ($(window).width() < 1070) {
	            $("#QuickMenu").hide();
	        }
	        else {
	            //$("#QuickMenu").floating({ targetX: "right", targetY: "top", contentsWidth: 946, topMargin: 60 }).show();
	            var tmpX = $("#imgUserVisual").offset().left + 725;

	            $("#QuickMenu").floating({ targetX: tmpX, targetY: "top", topMargin: 70 }).show();

	            //익스플로러 이면서 버전이 8보다 낮을 경우 숨김
	            if (fnCheckBrowser() == "I") {
	                if (Number($.browser.version) < 8) {
	                    //호환성 보기 때문에 막아놓음
	                    //$("#QuickMenu").hide();
	                }
	            }
	        }
	    }
	    catch (exception) { }

	    try {
	        // init text editor ( if exists )
	        $('.htmlEditor').cleditor({
	            width: 500,
	            height: 400
	        });
	    }
	    catch (exception) { }

	    try {
	        // init numericUpDown ( if exists )
	        $('.numiricUpDown').numericUpDown({
	            start: (new Date()).getFullYear(),
	            min: 1900,
	            max: (new Date()).getFullYear() + 10,
	            step: 1,
	            rootPath: __rootPath
	        });
	    }
	    catch (exception) { }

	    if (__isModal) {
	        __containerID = '#WrapperPop';
	    }

	    setFormatData();

	    $(window).bind('resize', function () {
	        try {
	            if ($(window).width() < 1070) {
	                $("#QuickMenu").hide();
	            }
	            else {
	                //$("#QuickMenu").floating({ targetX: "right", targetY: "top", contentsWidth: 946, topMargin: 60 }).show();
	                var tmpX = $("#imgUserVisual").offset().left + 725;

	                $("#QuickMenu").floating({ targetX: tmpX, targetY: "top", topMargin: 70 }).show();

	                //익스플로러 이면서 버전이 8보다 낮을 경우 숨김
	                if (fnCheckBrowser() == "I") {
	                    if (Number($.browser.version) < 8) {
	                        //호환성 보기 때문에 막아놓음
	                        //$("#QuickMenu").hide();
	                    }
	                }
	            }
	        } catch (e)
            { }
	    });
	}
);

function replaceTranslatedImage(obj, attr) {
	var url = $(obj).attr(attr);
	if (url == undefined) {
		return;
	}

	url = url.replace('KO/', '');

	var newUrl = url.substr(0, url.lastIndexOf('/') + 1);
	newUrl += __languageCode + '/' + url.substr(newUrl.length);

	$(obj).attr(attr, newUrl);
}

function initEditor(controlID, width, height) {
	$(controlID).cleditor({
		width: width,
		height: height
	});
}

// 년도 선택 초기화
// parameters
//		controlID: 설정할 컨트롤 ID
//		start: 시작 값
//		min: 최소값
//		max: 최대값
//		step: 증가/감소 간격
//		width: 텍스트박스 너비
function initNumericUpdown(controlID, start, min, max, step, width) {
	$(controlID).numericUpDown({
		start: start,
		min: min,
		max: max,
		step: step,
		width: width,
		rootPath: __rootPath
	});
}

// 년도 선택값 가져오기
// parameters
//		controlID: 설정할 컨트롤 ID
function getUpDownValue(controlID) {
	return $(controlID).numericUpDown('value');
}

// 모달 대화상자 초기화
// parameters
//		controlID: 탭 컨트롤이 들어갈 DIV태그의 ID
//		width: 너비
//		height: 높이
//		initParam: [optional] 대화상내 내부의 컨텐츠 환경설정
//			fileName: [optional] 동적으로 로드할 ASPX/ASCX 컨트롤.
//			params: [optional] 각 파라미터는 POST 데이터로 ASPX/ASCX에 전달이 된다.
function showLayerDialog(controlID, width, height, initParam) {
	// check ascx / aspx
	var isAspx = false;

	if (initParam != undefined) {
		var extension = initParam.fileName.substring(initParam.fileName.lastIndexOf('.') + 1).toLowerCase();

		isAspx = (extension == 'aspx');
	}

	$(controlID).load((isAspx) ? initParam.fileName : __rootPath + 'USR/Dummy.aspx', initParam.params);

	$(controlID).dialog({
		width: width,
		height: height,
		modal: true
	});
}

// 탭 초기화
// parameters
//		controlID: 탭 컨트롤이 들어갈 DIV태그의 ID
//		autoGenerateHTML: true/false, HTML을 자동 생성할지 여부
//		initParam: object Array, 각 탭의 환경설정
//			title: 탭의 제목
//			fileName: [optional] 동적으로 로드할 ASPX/ASCX 컨트롤.
//						넣지 않는 경우는 컨텐츠 내용을 채우지 않는다.
//			params: [optional] 각 파라미터는 POST 데이터로 ASPX/ASCX에 전달이 된다.
function initTabs(controlID, autoGenerateHTML, initParam) {
	if (autoGenerateHTML == undefined) {
		autoGenerateHTML = false;
	}

	if (initParam == undefined) {
		initParam = null;
	}

	if (autoGenerateHTML) {
		$(controlID).html('');

		var tabHeaders = $('<ul></ul>');

		$(controlID).append(tabHeaders);
		var tabContainer1 = $('<div class="TabBox1" style="float: none;"></div>');
		var tabContainer2 = $('<div class="TabBox2"></div>');
		var tabContainer3 = $('<div class="TabBox3"></div>');
		var tabBottom = $('<div class="TabBoxB"><div></div></div>');

		for (var i = 0, max = initParam.length; i < max; i++) {
			tabHeaders.append('<li><a href="' + controlID + '-' + i + '"><span>' + initParam[i].title + '</span></a></li>');
			tabContainer3.append('<div id="' + controlID.replace('#', '') + '-' + i + '"></div>');
		}

		tabContainer1.append(tabContainer2.append(tabContainer3));
		$(controlID).append(tabContainer1);
		$(controlID).append(tabBottom);
	}

	$(controlID).tabs({
		select: function (event, ui) {
			if (initParam != null) {
				var param = initParam[ui.index];

				if ((param.fileName != undefined) && (param.fileName != '') && ($.trim($(controlID + '-' + ui.index).html()) == '')) {
					param.params.fileName = param.fileName;
					var extension = param.params.fileName.substring(param.params.fileName.lastIndexOf('.') + 1).toLowerCase();

					$(controlID + '-' + ui.index).load((extension == 'aspx') ? initParam.fileName : __rootPath + 'USR/Dummy.aspx', param.params);
				}
			}
		}
	});

	if ((initParam != null) && (initParam.length != $(controlID).tabs('length'))) {
		alert(controlID + '는 초기화 데이터와 탭의 숫자가 일치하지 않습니다.');
	}
}

function selectTab(controlID, index) {
	$(controlID).tabs('select', index);
}

// 엔터로 검색
// parameters
//		className: 엔터처리를 적용시킬 엘리먼트의 클래스명(.enterSearch)
//		buttonID: 엔터를 쳤을 때 적용할 엘리먼트의 아이디(#searchButton)
//		eventName: [optional] 위 buttonID 엘리먼트에서 발생할 이벤트(click)
function initEnterSearch(className, buttonID, eventName) {
	if (eventName == undefined) {
		eventName = 'click';
	}

	$(className).keydown(function (e) {
		if (e.keyCode == 13) {
			$(buttonID).trigger(eventName);
		}
	});
}

// 모달 창 오픈
// parameters
//		url: 주소
//		width: 너비
//		height: 높이
//		params: [optional] 다이알로그 창에 전달할 값
//		scroll: [optional] true / false. 스크롤을 허용할지 여부
function openModalDialog(url, width, height, params, scroll) {
	if (scroll == undefined) {
		scroll = false;
	}

	var scrollValue = 'no';

	if (scroll) {
		scrollValue = 'yes';
	}

	var feature = 'dialogHeight:' + height + 'px;dialogWidth:' + width + 'px;scroll:' + scrollValue + ';';

	var returnFromModal = showModalDialog(url, params, feature);

	if ((returnFromModal != undefined) && (returnFromModal != null)) {
		try {
		    if (returnFromModal.forceToLogin == true) {
		        alert(g_NO_SESSION);
		        //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
		        location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
				return;
			}
		}
		catch (exception) {
		}
	}

	return returnFromModal;
}

function setDialogTarget() {
	$('a').attr('target', __target);
}

// 모달 창 닫기
function closeModalDialog() {
	try {
		$(window).trigger('unload');
	}
	catch (exception) { }
	window.close();
}

// 타이머 시작
// parameters
//		controlID: 타이머 실행시 시간이 표시될 컨트롤의 ID
//		type: [optional] html / val. DIV, SPAN 등과 같이 HTML로 값이 표시되는 것은 html, 그외의 INPUT 과 같이 VALUE로 표시되는 것은 val
//		order: [optional] back or not. 역순으로 시간을 계산하려면 back.
//		totalSeconds: [optional] 역순으로 시간을 계산하는 경우 총 시간(초단위)
//		timeoutCallback: [optional] 역순으로 시간을 계산하는 경우 시간이 종료되었을 때 실행할 함수
function startTimer(controlID, type, order, totalSeconds, timeoutCallback) {
	if ((type == undefined)
		|| (type.toLowerCase() != 'html')
		|| (type.toLowerCase() != 'val')) {
		type = 'html';
	}

	var label = controlID.replace('#', '') + '_timer';
	var hiddenID = controlID + '_elapsedSecond';

	if ($(hiddenID).val() == undefined) {
		$(document.body).append('<input type="hidden" id="' + hiddenID.replace('#', '') + '" />');
	}

	$(controlID).everyTime(
		1000,
		label,
		function (i) {
			$(this).html(i).toTimeFormat(
				hiddenID,
				type,
				order,
				totalSeconds,
				function () {
					stopTimer(controlID);
					timeoutCallback();
				}
			);
		}
	);
}

// 타이머 종료
// parameters
//		controlID: 타이머 실행을 중지시킬 컨트롤의 ID
// return
//		현재 남은 시간을 초단위로 리턴
function stopTimer(controlID) {
	var label = controlID.replace('#', '') + '_timer';
	var hiddenID = controlID + '_elapsedSecond';

	$(controlID).stopTime(label);

	var sec = $(hiddenID).val();

	return sec;
}

// 타이머 시간 반환
// parameters
//		controlID: 타이머 실행을 중지시킬 컨트롤의 ID
// return
//		현재 남은 시간을 초단위로 리턴
function getTimerValue(controlID) {
	var hiddenID = controlID + '_elapsedSecond';

	return $(hiddenID).val();
}

// 달력 초기화
// parameters
//		fromControlID: 달력 컨트롤 아이디
//		toControlID: [optional] from, to의 용도로 사용할 경우에 끝 날짜의 달력.
function initCalendar(fromControlID, toControlID) {
	$.datepicker.setDefaults($.datepicker.regional[__languageCode.toLowerCase()]);

	var dates = $(fromControlID + ', ' + toControlID).datepicker({
		onSelect: function (selectedDate) {
			var option = this.id == fromControlID.replace('#', '') ? "minDate" : "maxDate", instance = $(this).data("datepicker");

			date = $.datepicker.parseDate(
					instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
					selectedDate, 
					instance.settings);

			dates.not(this).datepicker("option", option, date);
		}
	});
}

// 폼 초기화
// parameters
//		formID: Form 의 ID
//		beforeSubmit: 폼 전송 전에 실행할 함수
//		callback: 성공 후 실행할 콜백함수.
//      url: action url of the form
function initForm(formID, beforeSubmit, callback, url, valicationOptions) {
	if (typeof formID == 'object') {
		beforeSubmit = formID.beforeSubmit;
		callback = formID.callback;
		url = formID.url;
		valicationOptions = formID.valicationOptions;
		formID = formID.formID;
	}

	if (valicationOptions == undefined) {
	    $(formID).submit(function () {
	        if ((beforeSubmit != undefined) && (beforeSubmit != null)) {
	            if (beforeSubmit() == false) {
	                return false;
	            }
	        }
	        //넷퍼넬 주석
	        //NetFunnel_Action({ action_id: "EHRD_TEST" }, function (ev, ret) {
	            $(formID).attr('target', __target);
	            $(formID).attr('action', url);
	            // display loading...
	            showMask();

	            $(this).ajaxSubmit({
	                success: function (data) {
	                    var result = null;

	                    if (data.toUpperCase().substring(0, 6) == '<HEAD>') {
	                        data = data.replace('<HEAD>', '');
	                        data = data.replace('</HEAD>', '');
	                        data = data.replace('<BODY>', '');
	                        data = data.replace('</BODY>', '');
	                        data = data.replace('<head>', '');
	                        data = data.replace('</head>', '');
	                        data = data.replace('<body>', '');
	                        data = data.replace('</body>', '');
	                    }

	                    try {
	                        result = getJson(data);
	                    }
	                    catch (exception) {
	                        if ($.trim(data).substring(0, 1) == '<') {
	                            if (!__isModal) {
	                                alert(g_NO_SESSION);
	                                //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
	                                location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
	                                return;
	                            }
	                            else {
	                                window.returnValue = { forceToLogin: true };
	                                window.close();
	                                return;
	                            }
	                        }
	                        else {
	                            alert('잘못된 데이터입니다.\n' + data);
	                        }
	                    }

	                    callback(result);

	                    hideMask();
	                },
	                error: function (data) {
	                    alert('폼 전송시 에러 발생. error code: {0}, message: {1}'.format(data.status, data.statusText));

	                    if (confirm('전체 메시지를 보겠습니까?')) {
	                        alert(data.responseText);
	                    }

	                    hideMask();
	                }
	            });
	            //넷퍼넬 주석
	        //});
	        return false;
	    });
	}
	else {
	    valicationOptions.submitHandler = function (form) {
	        showMask();

	        $(form).ajaxSubmit({
	            success: function (data) {
	                var result = null;

	                try {
	                    result = getJson(data);
	                }
	                catch (exception) {
	                    if ($.trim(data).substring(0, 1) == '<') {
	                        if (!__isModal) {
	                            alert(g_NO_SESSION);
	                            //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
	                            location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
	                            return;
	                        }
	                        else {
	                            window.returnValue = { forceToLogin: true };
	                            window.close();
	                            return;
	                        }
	                    }
	                    else {
	                        alert('잘못된 데이터입니다.\n' + data);
	                    }
	                }

	                callback(result);

	                hideMask();
	            },
	            error: function (data) {
	                alert('폼 전송시 에러 발생. error code: {0}, message: {1}'.format(data.status, data.statusText));

	                if (confirm('전체 메시지를 보겠습니까?')) {
	                    alert(data.responseText);
	                }

	                hideMask();
	            }
	        });
	    };

	    $(formID).validate(valicationOptions);
	}
}

// 파일 업로드 폼 초기화
// parameters
//		formID: Form 의 ID
//		beforeSubmit: 폼 전송 전에 실행할 함수
//		callback: 성공 후 실행할 콜백함수.
function initFileForm(formID, beforeSubmit, callback, url) {
	$(formID).attr('enctype', 'multipart/form-data');

	$(formID).submit(function () {
		if ((beforeSubmit != undefined) && (beforeSubmit != null)) {
			if (!beforeSubmit()) {
				return false;
			}
		}

		$(formID).attr('target', __target);
		$(formID).attr('action', url);

		// display loading...
		showMask(30);

		$(this).ajaxSubmit({
			success: function (data) {
				var result = null;

				if (data.toUpperCase().substring(0, 6) == '<HEAD>') {
					data = data.replace('<HEAD>', '');
					data = data.replace('</HEAD>', '');
					data = data.replace('<BODY>', '');
					data = data.replace('</BODY>', '');
					data = data.replace('<head>', '');
					data = data.replace('</head>', '');
					data = data.replace('<body>', '');
					data = data.replace('</body>', '');
				}

				try {
					result = getJson(data);
				}
				catch (exception) {
					if ($.trim(data).substring(0, 1) == '<') {
					    if (!__isModal) {
					        alert(g_NO_SESSION);
					        //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
					        location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
							return;
						}
						else {
							window.returnValue = { forceToLogin: true };
							window.close();
							return;
						}
					}
					else {
						alert('잘못된 데이터입니다.\n' + data);
					}
				}

				hideMask();

				callback(result);
			},
			error: function (data) {
				alert('폼 전송시 에러 발생. error code: {0}, message: {1}'.format(data.status, data.statusText));

				if (confirm('전체 메시지를 보겠습니까?')) {
					alert(data.responseText);
				}

				hideMask();
			}
		});

		return false;
	});
}

// 서버로부터 데이터 받아오기
//	parameters
//		options: object
//			module: Ajax_{0}.aspx로 이루어지는 모듈명. 동일 폴더에 존재해야한다.
//				또는 모든 변수를 담는 오브젝트
//			formData: object 형태로, 모듈에 Form[""] 의 형태로 전달이 된다.
//			successCallback: [optional] 리스트 바인딩 성공 후 실행할 함수
//			showProgress: probress를 보일지 여부
function getData(options) {
	if ((options.module == '') || (options.formData == null) || (options.successCallback == null)) {
		return;
	}

	// display loading...
	if (options.showProgress != false) {
		showMask();
	}

	var fileUrl = '';

	if (options.module.indexOf('/') >= 0) {
	    fileUrl = __rootPath + options.module;
	}
	else {
	    fileUrl = 'Ajax_' + options.module + '.aspx';
	}

    //순차적으로 진행하기 위함
	var chkAsync = true;

	if (options.chkAsync != undefined) {
	    chkAsync = options.chkAsync;
	}

	$.ajax({
		url: fileUrl,
		data: options.formData,
		type: 'POST',
		//dataType: 'json',
		async: chkAsync,
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert('오류가 발생했습니다. 컴파일오류 또는 404 오류일 수 있습니다.');
		},
		success: function (data) {
			var records = null;

			try {
				records = getJson(data);
			}
			catch (exception) {
				if ($.trim(data).substring(0, 1) == '<') {
				    if (!__isModal) {
				        alert(g_NO_SESSION);
				        //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
				        location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
						return;
					}
					else {
						window.returnValue = { forceToLogin: true };
						window.close();
						return;
					}
				}
				else {
					alert('잘못된 데이터입니다.\n' + data);
				}
			}

			if (records.IsError) {
				alert(records.ErrorCode);
				if (options.showProgress != false) {
					hideMask();
				}
				return;
			}

			if (options.successCallback != undefined) {
				options.successCallback(records);
			}

			setFormatData();

			if (options.showProgress != false) {
				hideMask();
			}
		}
	});
}

function getDataNew(options) {
    if ((options.module == '') || (options.formData == null) || (options.successCallback == null)) {
        return;
    }

    // display loading...
    if (options.showProgress != false) {
        showMask();
    }

    var fileUrl = '';

    if (options.module.indexOf('/') >= 0) {
        fileUrl = __rootPath + options.module;
    }
    else {
        fileUrl = 'Ajax_' + options.module + '.aspx';
    }

    //순차적으로 진행하기 위함
    var chkAsync = true;

    if (options.chkAsync != undefined) {
        chkAsync = options.chkAsync;
    }

    $.ajax({
        url: fileUrl,
        data: options.formData,
        type: 'POST',
        //dataType: 'json',
        async: chkAsync,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('오류가 발생했습니다. 컴파일오류 또는 404 오류일 수 있습니다.');
        },
        success: function (data) {
            var records = null;

            try {
                records = getJson(data);
            }
            catch (exception) {
                if ($.trim(data).substring(0, 1) == '<') {
                    if (!__isModal) {
                        alert(g_NO_SESSION);
                        //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
                        location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
                        return;
                    }
                    else {
                        window.returnValue = { forceToLogin: true };
                        window.close();
                        return;
                    }
                }
                else {
                    alert('잘못된 데이터입니다.\n' + data);
                }
            }

            if (records.IsError) {
                if (options.showProgress != false) {
                    hideMask();
                }
            }

            if (options.successCallback != undefined) {
                options.successCallback(records);
            }

            setFormatData();

            if (options.showProgress != false) {
                hideMask();
            }
        }
    });
}

// 리스트 바인딩
// parameters
//		module: Ajax_{0}.aspx로 이루어지는 모듈명. 동일 폴더에 존재해야한다.
//				또는 모든 변수를 담는 오브젝트
//		formData: object 형태로, 모듈에 Form[""] 의 형태로 전달이 된다.
//		headerTemplateID: 리스트의 헤더를 출력할 템플릿의 아이디
//		templateID: 리스트를 출력할 템플릿의 아이디
//		containerID: 리스트를 출력할 컨테이너
//		pagerID: [optional] 페이저 컨테이너
//		forceToBind: [optional] 강제로 리스트 출력할지 여부
//		pageSize: [optional] 리스트에 보여줄 숫자, 기본값 10(페이저에만 연관이 된다.)
//		successCallback: [optional] 리스트 바인딩 성공 후 실행할 함수
//		listData: [optional] 리스트에 바인딩할 데이터(이것이 있으면 직접 바인딩을 한다.
//		showProgress: probress를 보일지 여부
//		onItemDataBound: [optional] 리스트에 아이템이 바인딩될 때 발생하는 이벤트. function (evt): 
//									evt: 
//										row: 현재 row의 json 객체
//										data: 현재 row의 데이터
//										index: 현재 row의 인덱스
//		noDataMessage: 데이터가 없을 때 보여질 메시지
//		showNoDataMessage: 데이터가 없다는 메시지를 보여줄지 여부
function bindList(module, formData, headerTemplateID, templateID, containerID,
	pagerID, forceToBind, pageSize, successCallback, listData, onItemDataBound, 
	footerTemplateID, showProgress, noDataMessage, showNoDataMessage, pageSelected) {
	/// <summary>리스트 바인딩
	/// </summary>
	/// <param name="module" type="String">Ajax_{0}.aspx로 이루어지는 모듈명. 동일 폴더에 존재해야한다. 또는 모든 변수를 담는 오브젝트</param>
	/// <param name="formData" type="object">모듈에 Form[""] 의 형태로 전달이 된다.</param>
	/// <param name="headerTemplateID" type="String">리스트의 헤더를 출력할 템플릿의 아이디</param>
	/// <param name="templateID" type="String">리스트를 출력할 템플릿의 아이디</param>
	/// <param name="containerID" type="String">리스트를 출력할 컨테이너</param>
	/// <param name="pagerID" type="String">페이저 컨테이너</param>
	/// <param name="forceToBind" type="Boolean">강제로 리스트 출력할지 여부</param>
	/// <param name="pageSize" type="Integer">리스트에 보여줄 숫자, 기본값 10(페이저에만 연관이 된다.)</param>
	/// <param name="successCallback" type="function">리스트 바인딩 성공 후 실행할 함수</param>
	/// <param name="listData" type="object">리스트에 바인딩할 데이터(이것이 있으면 직접 바인딩을 한다.</param>
	/// <param name="onItemDataBound" type="function">리스트에 아이템이 바인딩될 때 발생하는 이벤트. function (evt): 
	///									evt: 
	///										row: 현재 row의 json 객체
	///										data: 현재 row의 데이터
	///										index: 현재 row의 인덱스</param>
	/// <param name="footerTemplateID" type="String">리스트의 푸터를 출력할 템플릿의 아이디</param>
	/// <param name="showProgress" type="Boolean">probress를 보일지 여부</param>
	/// <param name="noDataMessage" type="String">데이터가 없을 때 보여질 메시지</param>
	/// <param name="showNoDataMessage" type="Boolean">데이터가 없다는 메시지를 보여줄지 여부</param>
	if (typeof module == 'object') {
		formData = module.formData;
		headerTemplateID = module.headerTemplateID;
		templateID = module.templateID;
		containerID = module.containerID;
		pagerID = module.pagerID;
		forceToBind = module.forceToBind;
		pageSize = module.pageSize;
        pageSelected = module.pageSelected;
		successCallback = module.successCallback;
		listData = module.listData;
		onItemDataBound = module.onItemDataBound;
		footerTemplateID = module.footerTemplateID;
		showProgress = module.showProgress;
		noDataMessage = module.noDataMessage;
		showNoDataMessage = module.showNoDataMessage;
		module = module.module;
	}

	if ((noDataMessage == undefined) || (noDataMessage == '')) {
		noDataMessage = __noRecordMessage;
	}

	// display loading...
	if (showProgress != false) {
		showMask();
	}

	var container = (typeof containerID == 'string') ? $(containerID) : containerID;

	container.html($(headerTemplateID).html());
	$('#__nodata__').remove();

	if (listData) {
	    if (listData.length > 0) {
	        container.append($(templateID).tmpl(
				listData,
				{
				    onItemDataBound: function (evt) {
				        if (onItemDataBound != undefined) {
				            evt.data = listData[evt.index];

				            onItemDataBound(evt);
				        }
				    }
				}
			));

	        if (successCallback != undefined) {
	            successCallback(listData);
	        }

	        setFormatData($(containerID));

	        container.append($($(footerTemplateID).html()));
	    }
	    else {
	        if (pagerID != undefined) {
	            $(pagerID).html('');
	        }

	        if (showNoDataMessage != false) {
	            $('<div id="__nodata__" class="attention"><img src="' + __rootPath + 'Include/Images/User/icon/icon_attention.gif" />' + noDataMessage + '</div>').insertAfter(container);
	        }
	    }

	    if (showProgress != false) {
	        hideMask();
	    }

	    return;
	}

	if (!pageSize) {
		pageSize = _pageSize;
	}

	if (!forceToBind) {
		forceToBind = true;
	}

	if (!formData.page) {
		formData = getPagerParam(formData, 1, pageSize);
	}

	var fileUrl = '';

	if (module.indexOf('/') >= 0) {
		fileUrl = __rootPath + module;
	}
	else {
		fileUrl = 'Ajax_' + module + '.aspx';
	}

	$.ajax({
	    url: fileUrl,
	    data: formData,
	    type: 'POST',
	    //dataType: 'json',
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        alert('오류가 발생했습니다. 컴파일오류 또는 404 오류일 수 있습니다.');
	    },
	    success: function (data) {
	        var records = null;

	        try {
	            records = getJson(data);
	        }
	        catch (exception) {
	            if ($.trim(data).substring(0, 1) == '<') {
	                if (!__isModal) {
	                    alert(g_NO_SESSION);
	                    //location.href = __rootPath + 'Login.aspx?url=' + encodeURIComponent(location.href);
	                    location.href = __rootPath + 'SLogin.aspx?isLoginPage=Y';
	                    return;
	                }
	                else {
	                    window.returnValue = { forceToLogin: true };
	                    window.close();
	                    return;
	                }
	            }
	            else {
	                alert('잘못된 데이터입니다.\n' + data);
	            }
	        }

	        if (records.IsError) {
	            alert(records.ErrorCode);
	            if (showProgress != false) {
	                hideMask();
	            }
	            return;
	        }

	        if (records.record.length > 0) {
	            totalRecordCount = records.totalRecordCount;

	            container.append($(templateID).tmpl(
					records.record,
					{
					    onItemDataBound: function (evt) {
					        if (onItemDataBound != undefined) {
					            evt.data = records.record[evt.index];

					            //setChildFormat(evt.row);

					            onItemDataBound(evt);
					        }
					    }
					}
				));

	            container.append($($(footerTemplateID).html()));

	            var pageCount = totalRecordCount / pageSize;

	            if ((totalRecordCount % pageSize) > 0) {
	                pageCount++;
	            }

	            if (pagerID) {
	                if (($.trim($(pagerID).html()) == '') || (forceToBind)) {
	                    var tmpSelectedPage = 1;
	                    if (!pageSelected) {
	                        tmpSelectedPage = 1;
	                    }
	                    else {
	                        tmpSelectedPage = pageSelected;
	                    }
	                    $(pagerID).html('');
	                    $(pagerID).zPaging(
							pageCount
							, onPagerClick
							, {
							    module: module,
							    formData: formData,
							    gridID: containerID,
							    headerTemplateID: headerTemplateID,
							    templateID: templateID,
							    containerID: containerID,
							    pagerID: pagerID,
							    pageSize: pageSize,
							    onItemDataBound: onItemDataBound
							}, {
							    align: 'center',
							    key: 'page',
							    movement: 5,
							    perPage: 10,
							    selectedPage: tmpSelectedPage,
							    linkWidth: 25,
							    viewInfo: false,
							    goFirstImageUrl: __rootPath + 'include/Images/User/button/list_pre2.gif',
							    goPrevImageUrl: __rootPath + 'include/Images/User/button/list_pre.gif',
							    goNextImageUrl: __rootPath + 'include/Images/User/button/list_next.gif',
							    goLastImageUrl: __rootPath + 'include/Images/User/button/list_next2.gif'
							}, {
							    nowPage: 'nowPage',
							    normalPage: 'normalPage'
							}
						);
	                }
	            }

	            if (__isModal && $.browser.msie) {
	                setDialogTarget();
	            }

	            setFormatData($(containerID));
	        }
	        else {
	            if (pagerID != undefined) {
	                $(pagerID).html('');
	            }

	            if (showNoDataMessage != false) {
	                $('<div id="__nodata__" class="attention"><img src="' + __rootPath + 'Include/Images/User/icon/icon_attention.gif" />' + noDataMessage + '</div>').insertAfter(container);
	            }
	        }

	        if (successCallback != undefined) {
	            successCallback(records.record);
	        }

	        if (showProgress != false) {
	            hideMask();
	        }
	    } // end of success
	});
}

function onPagerClick(data) {    
	bindList({
		module: data.module, 
		formData: getPagerParam(data.formData, data.page, data.pageSize), 
		headerTemplateID: data.headerTemplateID,
		templateID: data.templateID,
		containerID: data.containerID,
		pagerID: data.pagerID,
		forceToBind: false,
		pageSize: data.pageSize,
        pageSelected: data.page,
		onItemDataBound: data.onItemDataBound
	});
}

function getPagerParam(formData, page, pageSize) {
	formData.page = page;
	formData.pageSize = pageSize;

	return formData;
}

function generateFormData(data) {
	var param = '';

	for (var key in data) {
		if (param != '') {
			param += '&';
		}

		param += key;
		param += '=';
		param += data[key];
	}

	return param;
}

function showMask(estimatedTime) {
	if (estimatedTime == undefined) {
		estimatedTime = 3;
	}

	__maskStack.push(estimatedTime);

	if (__maskStack.length == 1) {
		if (__isModal) {
			__containerID = '#WrapperPop';
		}

		$(__containerID).mask({ estimatedTime: estimatedTime });
	}
}

function hideMask() {
	__maskStack.pop();

	if (__maskStack.length == 0) {
		if (__isModal) {
			__containerID = '#WrapperPop';
		}

		$(__containerID).unmask();
	}
}

function getJson(data) {
	return eval('(' + data.split('\n').join('').split('\r').join('') + ')'); ;
}

function setChildFormat(row) {
	row.children().each(function (index, element) {
		setChildFormat2($(element));
	});
}

function setChildFormat2(child) {
	if ($(child).attr('dataType') != undefined) {
		switch ($(child).attr('dataType').toLowerCase()) {
			case 'date':
				{
					//$(child).html('test');
				}
				break;

			default:
				break;
		}
	}

	child.children().each(function (index, element) {
		setChildFormat2($(element));
	});
}

// 출력된 데이터들의 포맷맞추기
function setFormatData($obj) {
	setDateFormat($obj);
	setCurrencyFormat($obj);
	setTelFormat($obj);
}

// 전화번호 포맷으로 변환
function setTelFormat($obj) {
	var elements;

	if ($obj == undefined) {
		elements = $('.telFormat');
	}
	else {
		elements = $obj.find('.telFormat');
	}

	elements.each(function (idx, elem) {
		if ($(elem).is(":input")) {
			$(elem).val($.format2().tel($(elem).val()));
		} else {
			$(elem).text($.format2().tel($(elem).text()));
		}
	});
}

// 통화 포맷으로 변환
function setCurrencyFormat($obj) {
	var elements;

	if ($obj == undefined) {
		elements = $('.currencyFormat');
	}
	else {
		elements = $obj.find('.currencyFormat');
	}

	elements.each(function (idx, elem) {
		if ($(elem).is(":input")) {
			$(elem).css('text-align', 'right').val($.format2().currency($(elem).val()));
		} else {
			$(elem).text($.format2().currency($(elem).text()));
		}
	});
}

// 날짜 포맷으로 변경
function setDateFormat($obj) {
	var shortElements, longElements, yyyymmElements;

	if ($obj == undefined) {
		shortElements = $('.shortDateFormat');
		longElements = $('.longDateFormat');
		yyyymmElements = $('.yyyymmFormat');
	}
	else {
		shortElements = $obj.find('.shortDateFormat');
		longElements = $obj.find('.longDateFormat');
		yyyymmElements = $obj.find('.yyyymmFormat');
	}

	shortElements.each(function (idx, elem) {
		if ($(elem).is(":input")) {
			$(elem).val($.format2().date($(elem).val(), 'yyyy.MM.dd'));
		} else {
			$(elem).text($.format2().date($(elem).text(), 'yyyy.MM.dd'));
		}
	});
	longElements.each(function (idx, elem) {
		if ($(elem).is(":input")) {
			$(elem).val($.format2().date($(elem).val(), 'yyyy.MM.dd HH:mm:ss'));
		} else {
			$(elem).text($.format2().date($(elem).text(), 'yyyy.MM.dd HH:mm:ss'));
		}
	});
	yyyymmElements.each(function (idx, elem) {
		if ($(elem).is(":input")) {
			$(elem).val($.format2().date($(elem).val(), 'yyyy.MM'));
		} else {
			$(elem).text($.format2().date($(elem).text(), 'yyyy.MM'));
		}
	});
}

String.prototype.format = function () {
	try {
		var newValue = this;

		for (var i = 0, max = arguments.length; i < max; i++) {
			newValue = newValue.split('{' + i + '}').join(arguments[i]);
		}

		return newValue;
	}
	catch (exception) {
		return this;
	}
}

function excelDownload(options) {
	// module, formData
	var fileUrl = '';

	if (options.module.indexOf('/') >= 0) {
		fileUrl = __rootPath + options.module;
	}
	else {
		fileUrl = 'Ajax_' + options.module + '.aspx';
	}

	fileUrl += '?' + generateFormData(options.formData);

	var feature = 'width="{0}" height="{1}"';

	if (options.debug == true) {
		feature = feature.format('800', '500');
	}
	else {
		feature = feature.format('0', '0');
	}

	// iframe 추가
	$('body').append('<iframe src="{0}" {1}></iframe>'.format(fileUrl, feature));
}

function excelDownload2(options) {
	$('#__excel__').remove();

	var feature = 'width="{0}" height="{1}"';

	if (options.debug == true) {
		feature = feature.format('800', '500');
	}
	else {
		feature = feature.format('0', '0');
	}

	// iframe 추가
	$('body').append('<iframe id="__excel__" name="__excel__" {0}></iframe>'.format(feature));

	$('#dataToDisplay').val($('<div>').append($(options.tableID).eq(0).clone()).html());

	$('#excelForm').attr('action', __rootPath + 'USR/Common/Ajax_Common.aspx');

	$('#excelForm').submit();
}

(function ($) {
	$.fn.excel = function(options) {
		$('#__excel__').remove();

		var feature = 'width="{0}" height="{1}"';

		if (options.debug == true) {
			feature = feature.format('800', '500');
		}
		else {
			feature = feature.format('0', '0');
		}

		// iframe 추가
		$('body').append('<iframe id="__excel__" name="__excel__" {0}></iframe>'.format(feature));

		$('#dataToDisplay').val($('<div>').append($(this).eq(0).clone()).html());
		$('#TableName').val(options.tableName);

		$('#excelForm').attr('action', __rootPath + 'USR/Common/Ajax_Common.aspx');

		$('#excelForm').submit();
	};
})(jQuery);

//브라우저 체크하는 함수
function fnCheckBrowser() {
    var rtnValue = "";
    //익스플로러 일 경우
    if (navigator.appName.charAt(0) == "M") {
        rtnValue = "I";
    }
    else if (navigator.appName.charAt(0) == "N") {
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            rtnValue = "C";
        } else if (navigator.userAgent.indexOf("Firefox") != -1) {
            rtnValue = "F";
        } else if (navigator.userAgent.indexOf("Safari") != -1) {
            rtnValue = "S";
        }
    }
    return rtnValue;
}

//쿠키 설정
function fnSetCookie(strName, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = strName + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
}

//쿠키 가져오기
function fnGetCookie(strName) {
    var nameOfCookie = strName + "=";
    var x = 0;
    while (x <= document.cookie.length) {
        var y = (x + nameOfCookie.length);
        if (document.cookie.substring(x, y) == nameOfCookie) {
            if ((endOfCookie = document.cookie.indexOf(";", y)) == -1) {
                endOfCookie = document.cookie.length;
            }
            return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x == 0) {
            break;
        }
    }
    return;
}