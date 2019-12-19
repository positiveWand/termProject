
var screenMap;

var allTripList = null; //서버로부터 받은 여행들
var currentTravelingTrip = null; //현재 수정하고 있는 여행 이름
var currentShownMarker = []; //현재 지도에 있는 마커
var currentShowInfoWindow = []; //현재 지도에 있는 InfoWindow(정보창->마커 위에 표시)


var addedTrip_map_center = [];
var addedTrip_map_level = 0;

var currentNewPointMarker = null;

var receivedTripList = null; //서버로부터 전달받은 여행 "전체"
var current_shownTripList = null; //현재 화면에 보여지고 있는 여행들
var tripSelected = false;
var selectedTripName = "";
var selectedTripDatetime = "";
var newTrip = false;

$(document).ready(function() {
    readyMap(); //지도 준비

    //초기화면 설정(숨겨야하는 요소들 숨기기)
    $(".emptyListMessage").hide();
    $("#closeLookDiv").hide();
    $("#selectPositionMessage").hide();
    $("#oneTravelControl").hide();
    $("#newPointControl").hide();

    $("#pointListDiv").hide();
    $("#pointList").sortable(); //

    //첫 화면 로드(서버로부터 정보를 가져와 출력)
    changeScreen_mainPage()
    //추가된 요소(동적요소)들에 이벤트 리스너 붙이기
    attachDynamicEventListeners()


    //정적인 요소들에 이벤트 리스너 붙여주기
    //"자세히 보기" 버튼
    $("#closeLookDiv button").on("click", function() {
        changeScreen_oneTrip(selectedTripName);
        newTrip = false;
    });

    //여행 세부정보의 "저장하기" 버튼
    $("#saveTrip").on("click", function() {
        $("#tripName").attr("readonly", true);
        var valid = true;
        //여행 이름, 기간, 요약 validate
        if($("#tripName").val().trim() == "" || $("#tripDescription").val().trim() == "") {
            alert("제목과 요약을 채워주세요.");
            valid = false;
        }
        if($("#tripStartDate").val() == "" || $("#tripEndDate").val() == "" || new Date($("#tripEndDate").val()) < new Date($("#tripStartDate").val())) {
            alert("기간을 알맞게 설정해주세요");
            valid = false;
        }
        //저장에 대한 confirm창
        if(valid && confirm("저장하시겠습니까?")) {
            //여행 이름, 기간, 요약 저장
            $.ajax({
                url: "./saveTrip.php",
                type: "post",
                data: $("#oneTravelInfo").serialize()+"&mapLat="+screenMap.getCenter().getLat()+"&mapLng="+screenMap.getCenter().getLng()+"&mapLevel="+screenMap.getLevel()+"&newTrip="+newTrip
            }).done(function(data) {
                console.log(data);
                //입력 필드 초기화
                $("#tripName").val("");
                $("#tripDescription").val("");
                $("#tripStartDate").val("");
                $("#tripEndDate").val("");
                //화면 전환(첫 화면)
                changeScreen_mainPage();
            });
        }
    });

    //일정 추가하기 화면의 "저장하기"
    $("#savePoint").on("click", function() {
        var valid = true;
        //일정 이름, 날짜, 요약 validate
        if($("#pointName").val().trim() == "" || $("#pointDescription").val().trim() == "") {
            alert("제목과 요약을 채워주세요.");
            valid = false;
        }
        if($("#pointDate").val() == "") {
            alert("기간을 알맞게 설정해주세요");
            valid = false;
        }
        //저장에 대한 confirm창
        if(valid && confirm("저장하시겠습니까?")) {
            //(빨간색)마커 위치 저장
            var newPointPosition = currentNewPointMarker.getPosition(); //마커 현재 위치 저장
            currentNewPointMarker.setMap(null); //마커 지도에서 삭제
            console.log(newPointPosition);

            //일정 이름, 기간, 요약 저장
            $.ajax({
                url: "./savePoint.php",
                type: "post",
                data: $("#pointInfoForm").serialize()+"&tripName="+currentTravelingTrip["title"]+"&lat="+newPointPosition.getLat()+"&lng="+newPointPosition.getLng()
            }).done(function(data) {
                console.log(data);
                //입력 필드 초기화
                $("#pointName").val("");
                $("#pointDescription").val("");
                $("#pointDate").val("");
                //화면 전환
                changeScreen_oneTrip(currentTravelingTrip["title"]);
            });

        }
    });

    //"여행 추가하기" 버튼
    $("#addTripButton").on("click", function(){
        /*
        *<화면 전환>
        *-지도의 초기 위치(여행의 시작 위치)를 설정하도록함
        *-설정 후에 여행 편집 컨트롤로 넘어감
        */

        clearMap(); //지도 비우기(마커, 인포윈도우 삭제)

        //지도 초기 위치 설정 화면
        //content내용 전환
        $("#tripListDiv").hide(700);
        $("#selectPositionMessage").show();
        //control버튼들 비활성화
        $("#addTripButton").attr("disabled", true);
    });

    //"일정 추가하기" 버튼
    $("#addPointButton").on("click", function(){
        //control 내용 전환
        $("#oneTravelControl").hide();
        $("#newPointControl").show();

        $("#pointListDiv").hide();

        //지도 상 (초록색)마커 표시(움직일 수 있게)
        var aLatlng = screenMap.getCenter();
        currentNewPointMarker =  addMarker(aLatlng.getLat(), aLatlng.getLng(), "red", true, "");
        
    });

    //"여기 입니다!" 버튼(여행 추가하기 후에 나타남)
    $("#thisPlaceButton").on("click", function() {
        //확인 메세지 출력
        //만약 선택됐다면 다음 화면으로 넘어감
        //컨트롤 화면 바뀜
        var continueAdd = confirm("이 위치에서 여행을 시작할까요?");
        if(continueAdd) {
            addedTrip_map_center = screenMap.getCenter();
            addedTrip_map_level = screenMap.getLevel();

            changeScreen_oneTrip("");
            newTrip = true;

            $("#tripName").attr("readonly", false);
        }
    });
    //여행 추가하기 화면 중 "취소하기" 버튼
    $("#addTripCancel").on("click", function() {
        /*
        *<화면 전환>
        *-"여행 추가하기"를 취소함
        *-초기화면으로 돌아간다
        */

        //control버튼들 다시 활성화
        $("#addTripButton").attr("disabled", false);

        //content내용 전환
        $("#selectPositionMessage").hide();
        $("#tripListDiv").show(700);
    });
});

//웹페이지가 처음 로드될때 지도를 생성하여 출력한다
function readyMap() {
    var container = document.getElementById("kakaoMap"); // 지도를 표시할 div
    var options = { //지도의 초기설정값
        center: new kakao.maps.LatLng(36.371800, 127.347759),
        level: 3
    };

    screenMap = new kakao.maps.Map(container, options); //지도 생성

    //지도 위 컨트롤 올리기
    //1. 지도 타입 컨트롤(일반 지도, 위성 지도)
    var mapTypeControl = new kakao.maps.MapTypeControl(); //지도의 타입 컨트롤 생성
    screenMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT); //컨트롤 추가(왼쪽 위)
    //2. 지도 확대/축소 컨트롤
    var zoomControl = new kakao.maps.ZoomControl(); //지도의 확대/축소 컨트롤 생성
    screenMap.addControl(zoomControl, kakao.maps.ControlPosition.LEFT); //컨트롤 추가(왼쪽)
    /*
    kakao.maps.event.addListener(screenMap, 'click', function(mouseEvent) {        
    
        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlng = mouseEvent.latLng; 
        
        // 마커 위치를 클릭한 위치로 옮깁니
        
        console.log(latlng)
        
    });
    */
}

//서버로부터 메인페이지에 필요한 여행정보들을 가져와 화면에 출력
function getAndShowTripList() {
    $.getJSON( "./data/all_trips_summary.json", function( data ) {
        allTripList = data; //전달된 정보 저장(전역변수)
        showTripList(); //저장된 정보를 이용해 알맞게 화면에 출력
        attachDynamicEventListeners(); //동적으로 추가된 HTML요소들에 이벤트 리스너 부착
    });
}

//전역변수에 저장된 정보를 토대로 HTML요소 제작 후 출력
function showTripList() {
    $("#tripList").text("");
    var noItems = true;
    var items = [];
    $.each( allTripList, function(index, aTrip) {
        noItems = false;
        var anItem = "<li>";
        $.each( aTrip, function(key, val) {
            if(key == "title") {
                anItem += "<p><span class=\"peekTitle\">" + val + "</span> <span class=\"peekDate\">";
            }
            else if(key == "startDate") {
                anItem += "기간 :" + val + " ~ ";
            }
            else if(key == "endDate") {
                anItem += val + "</span></p>";
            }
        });
        anItem += "<a href=\"#\" class=\"imageWrapper\"><img src=\"./source/slideshow.png\" alt=\"되돌아보기 여행\" class=\"contentBarImage\"></a>";
        anItem += "</li>"

        items.push(anItem);
    });

    if(noItems) {
        $("#emptyTripList").show();
    }

    $("#tripList").append(items.join(""));
}

//여행 미리보기 시에 호출되는 함수(일정들에 대한 대략적인 정보를 지도에 출력)
function showPreviewMap(aTripName) {
    clearMap(); //지도 초기화
    var foundTrip = null;
    var foundPoints = [];
    //저장돼있던 정보 가저오기
    $.each(allTripList, function(index, aTrip){
        //리스트를 서치하여 원하는 Trip정보 가져오기
        if(aTrip["title"] == aTripName) {
            foundTrip = aTrip;
            foundPoints = aTrip["mainPoints"];
            return true;
        }
    });
    //지도 확대하기
    screenMap.setLevel(foundTrip["mapLevel"]);
    //지도 중심 좌표 (부드럽게)옮기기
    screenMap.panTo(new kakao.maps.LatLng(foundTrip["mapCenter"]["lat"], foundTrip["mapCenter"]["lng"]));
    //지도 상에 (파란색)마커 표시
    $.each(foundPoints, function(index, aMarkerLocation) {
        addMarker(aMarkerLocation.lat, aMarkerLocation.lng, "blue", false, "");
    });
}


//지도를 초기화(기존에 있던 마커, 인포윈도우 삭제)
function clearMap() {
    $.each(currentShownMarker, function(index, aMarker) {
        //모든 마커 삭제(지도에서부터)
        aMarker.setMap(null);
    });
    $.each(currentShowInfoWindow, function(index, aInfoWindow) {
        //모든 인포윈도우 삭제(지도에서부터)
        aInfoWindow.close();
    });
    currentShownMarker = []; //초기화
    currentShowInfoWindow = []; //초기화
}

//동적으로 추가되는 요소들에 이벤트 리스너를 부착해주는 함수
function attachDynamicEventListeners() {
    $("#tripList li").off("click");
    $(".accordion").off("click");

    //여행 리스트의 각 여행 아이템
    $("#tripList li").on("click", function(event) {
        //버튼처럼 toggle할 수 있고 on/off 될때 컨트롤과 지도의 모습이 바뀐다
        $("#tripList li").css("background-color", "rgb(61, 138, 238)");
        if ($(this).find("span[class='peekTitle']").text() != selectedTripName) {
            $(this).css("background-color", "rgb(43, 98, 170)");
            tripSelected = true;
            selectedTripName = $(this).find("span[class='peekTitle']").text();

            $("#closeLookDiv").show(700);
            showPreviewMap(selectedTripName); //해당 여행의 미리보기 출력
        }
        else {
            tripSelected = false;
            selectedTripName = "";
            $("#closeLookDiv").hide(700);
            clearMap();
        }
    })

    //일정 리스트의 일정 아이템
    $(".accordion").on("click", function() {
        //일정 리스트의 Drop-down리스트가 구현됨
        $(this).next().toggle(700);
        if($(this).attr("class") == "accordion") {
            $(this).attr("class", "accordion accordionActive");
            $("#pointList").sortable("disable");
        }
        else {
            $(this).attr("class", "accordion");
            $("#pointList").sortable("enable");
        }
    });
}

//특정 여행(aTripName)을 서버로부터 요청해 구체적인 정보를 가져오고 이를 토대로 웹페이지 전환(여행 세부정보)
function changeScreen_oneTrip(aTripName) {
    clearMap(); //지도 초기화

    //화면 전환
    //숨겨야할 요소 숨기기
    $("#tripListDiv").hide();
    $("#selectPositionMessage").hide();
    $("#travelListControl").hide();
    $("#newPointControl").hide();
    $("#emptyPointsList").hide();

    //보여야할 요소 보이기
    $("#controlTitle").text("~여행 중~");
    $("#oneTravelControl").show();
    $("#pointListDiv").show();
    $("#pointList").text(""); //리스트 요소 초기화

    if(aTripName == "") { //새로운 여행을 등록하는 경우
        //아무것도 하지 않는다
        $("#emptyPointsList").show();
    }
    else { //기존의 여행을 조회하는 경우
        //기존의 정보들을 가져와 출력한다
        //여행 이름, 여행 기간, 여행 요약, 지도 초기위치, 마커, 일정들에 대한 정보
        $.ajax({
            url: "./getTargetTrip.php",
            type: "post",
            data: "&targetTrip="+aTripName
        }).done(function(jsonData) {
            // 전달된 문자열 json으로, 객체로 해석
            console.log(jsonData);
            jsonData = JSON.parse(jsonData);
            // 전역 변수 갱신
            currentTravelingTrip = jsonData;

            // 여행 관련 정보 출력(이름, 기간, 요약, 지도 초기위치)
            $("#tripName").val(currentTravelingTrip["title"]);
            $("#tripStartDate").val(currentTravelingTrip["startDate"]);
            $("#tripEndDate").val(currentTravelingTrip["endDate"]);
            $("#tripDescription").val(currentTravelingTrip["description"]);
            
            screenMap.setLevel(currentTravelingTrip["mapLevel"]);
            screenMap.setCenter(new kakao.maps.LatLng(currentTravelingTrip["mapCenter"]["lat"], currentTravelingTrip["mapCenter"]["lng"]));


            // 각 일정들에 대한 정보(마커, 내용)
            var noItems = true;
            var items = [];
            $.each(currentTravelingTrip["pointsList"], function(index, aPoint) {
                noItems = false;
                var anItem = "<li>";

                $.each(aPoint, function(key, value) {
                    if(key == "pointName") {
                        anItem += "<div class=\"accordion\">"+value+"</div><ul class=\"toggleList\">";
                    }
                    else if(key == "date") {
                        anItem += "<li>날짜 : "+value+"</li>";
                    }
                    else if(key == "description") {
                        anItem += "<li>내용 : "+value+"</li></ul>" ;
                    }
                    else if(key == "pointLocation") {
                        addMarker(value["lat"], value["lng"], "blue", false, aPoint["pointName"]);
                    }
                });
                anItem += "</li>";

                items.push(anItem);
            });

            if(noItems) {
                $("#emptyPointsList").show();
            }

            $("#pointList").append(items.join(""));
            attachDynamicEventListeners();
        });
    }
}

//초기화면으로 돌아가는 함수
function changeScreen_mainPage() {
    //화면 전환
    $("#oneTravelControl").hide();
    $("#pointListDiv").hide();
    $("#newPointControl").hide();
    $("#selectPositionMessage").hide();
    $("#closeLookDiv").hide();
    $("#emptyTripList").hide();

    $("#controlTitle").text("여행 List");
    $("#tripListDiv").show();
    $("#travelListControl").show();

    //control버튼들 다시 활성화
    $("#addTripButton").attr("disabled", false);

    getAndShowTripList();
    clearMap();
}

//지도에 마커를 추가해주는 함수(인수들에 대한 정보를 토대로 원하는 마커를 지도에 추가해준다)
function addMarker(markerLat, markerLng, markerColor, draggable, markerContent) {
    //마커의 모습 결정하기
    var imageScr = "",
        imageSize = new kakao.maps.Size(40, 40),
        imageOption = {offset : new kakao.maps.Point(20, 50)};

    //마커의 색깔에 따른 이미지 선택
    if(markerColor == "blue") {
        imageScr = "./source/marker_blue.png"
    }
    else if(markerColor == "red") {
        imageScr = "./source/marker_red.png"
    }
    else if(markerColor == "green") {
        imageScr = "./source/marker_green.png"
    }
    else if(markerColor == "yellow") {
        imageScr = "./source/marker_yellow.png"
    }

    //마커의 이미지, 위치 정보
    var markerImage = new kakao.maps.MarkerImage(imageScr, imageSize, imageOption),
        markerPosition = new kakao.maps.LatLng(markerLat, markerLng);

    var newPointMarker = new kakao.maps.Marker({
        position : markerPosition,
        image : markerImage
    });

    newPointMarker.setMap(screenMap); //지도에 배치
    newPointMarker.setDraggable(draggable); //배치 후 옮길 수 있는지에 대한 여부 결정

    currentShownMarker.push(newPointMarker); //전역변수에 저장

    //인포윈도우 추가(요청되는 경우)
    if(markerContent != "") {
        var iwContent = '<div style="padding:5px;">'+markerContent+'</div>',
        iwPosition = new kakao.maps.LatLng(markerLat, markerLng); //인포윈도우 표시 위치

        // 인포윈도우를 생성
        var infowindow = new kakao.maps.InfoWindow({
            position : iwPosition, 
            content : iwContent 
        });
        

        infowindow.open(screenMap, newPointMarker); //인포윈도우 지도에 배치

        currentShowInfoWindow.push(infowindow); //전역변수에 저장
    }

    return newPointMarker; //생성된 마커 반환
}