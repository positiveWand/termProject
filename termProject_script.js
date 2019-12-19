
var screenMap;

var allTripList = null;
var currentTravelingTrip = null;
var currentShownMarker = [];


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
    readyMap();

    $(".emptyListMessage").hide();
    $("#closeLookDiv").hide();
    $("#selectPositionMessage").hide();
    $("#oneTravelControl").hide();
    $("#newPointControl").hide();

    $("#pointListDiv").hide();
    $("#pointList").sortable();

    //서버로부터 여행목록 가져오기
    //getTripList();
    //showTripList();
    changeScreen_mainPage()



    attachDynamicEventListeners()

    $("#closeLookDiv button").on("click", function() {
        changeScreen_oneTrip(selectedTripName);
        newTrip = false;
    });

    $("#saveTrip").on("click", function() {
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
        if(valid && confirm("저장하시겠습니까?")) {
            //여행 이름, 기간, 요약 저장
            $.ajax({
                url: "./saveTrip.php",
                type: "post",
                data: $("#oneTravelInfo").serialize()+"&mapLat="+screenMap.getCenter().getLat()+"&mapLng="+screenMap.getCenter().getLng()+"&mapLevel="+screenMap.getLevel()+"&newTrip="+newTrip
            }).done(function(data) {
                //입력 필드 초기화
                $("#tripName").val("");
                $("#tripDescription").val("");
                $("#tripStartDate").val("");
                $("#tripEndDate").val("");
                //화면 전환
                changeScreen_mainPage();
            });
        }
    });

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

        if(valid && confirm("저장하시겠습니까?")) {
            //(빨간색)마커 위치 저장
            var newPointPosition = currentNewPointMarker.getPosition(); //마커 현재 위치
            currentNewPointMarker.setMap(null); //마커 삭제
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


    $("#addTripButton").on("click", function(){
        /*
        *<화면 전환>
        *-지도의 초기 위치(여행의 시작 위치)를 설정하도록함
        *-설정 후에 여행 편집 컨트롤로 넘어감
        */

        clearMap();

        //지도 초기 위치 설정 화면
        //content내용 전환
        $("#tripListDiv").hide(700);
        $("#selectPositionMessage").show();
        //control버튼들 비활성화
        $("#addTripButton").attr("disabled", true);
    });

    $("#addPointButton").on("click", function(){
        //control 내용 전환
        $("#oneTravelControl").hide();
        $("#newPointControl").show();

        $("#pointListDiv").hide();

        //지도 상 (초록색)마커 표시(움직일 수 있게)
        var aLatlng = screenMap.getCenter();
        currentNewPointMarker =  addMarker(aLatlng.getLat(), aLatlng.getLng(), "red", true);
        
    });


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
        }
    });
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


    kakao.maps.event.addListener(screenMap, 'click', function(mouseEvent) {        
    
        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlng = mouseEvent.latLng; 
        
        // 마커 위치를 클릭한 위치로 옮깁니
        
        console.log(latlng)
        
    });
}
function getAndShowTripList() {
    $.getJSON( "./data/all_trips_summary.json", function( data ) {
        allTripList = data;
        showTripList();
        attachDynamicEventListeners();
    });
}

function showTripList() {
    $("#tripList").text("");
    var items = [];
    $.each( allTripList, function(index, aTrip) {
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

    $("#tripList").append(items.join(""));
}


function showPreviewMap(aTripName) {
    clearMap();
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
    //지도 중심 좌표 (부드럽게)옮기기
    screenMap.panTo(new kakao.maps.LatLng(foundTrip["mapCenter"]["lat"], foundTrip["mapCenter"]["lng"]));
    //지도 확대하기
    screenMap.setLevel(foundTrip["mapLevel"]);
    //지도 상에 (파란색)마커 표시
    $.each(foundPoints, function(index, aMarkerLocation) {
        addMarker(aMarkerLocation.lat, aMarkerLocation.lng, "blue", false);
    });
    //마커들 이어주기(선택)
}

function clearMap() {
    $.each(currentShownMarker, function(index, aMarker) {
        //모든 마커 삭제(지도에서부터)
        aMarker.setMap(null);
    });
    currentShownMarker = []; //초기화
}

function showMap() {

}

function attachDynamicEventListeners() {
    $("#tripList li").off("click");
    $(".accordion").off("click");

    $("#tripList li").on("click", function(event) {
        $("#tripList li").css("background-color", "rgb(61, 138, 238)");
        if ($(this).find("span[class='peekTitle']").text() != selectedTripName) {
            $(this).css("background-color", "rgb(43, 98, 170)");
            tripSelected = true;
            selectedTripName = $(this).find("span[class='peekTitle']").text();

            $("#closeLookDiv").show(700);
            showPreviewMap(selectedTripName);
        }
        else {
            tripSelected = false;
            selectedTripName = "";
            $("#closeLookDiv").hide(700);
            clearMap();
        }
    })


    $(".accordion").on("click", function() {
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

function changeScreen_oneTrip(aTripName) {
    clearMap();

    $("#tripListDiv").hide();
    $("#selectPositionMessage").hide();
    $("#travelListControl").hide();
    $("#newPointControl").hide();

    $("#controlTitle").text("~여행 중~");
    $("#oneTravelControl").show();
    $("#pointListDiv").show();

    $("#pointList").text("");
    if(aTripName == "") { //새로운 여행을 등록하는 경우
        //아무것도 하지 않는다
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

            screenMap.setCenter(new kakao.maps.LatLng(currentTravelingTrip["mapCenter"]["lat"], currentTravelingTrip["mapCenter"]["lng"]));
            screenMap.setLevel(currentTravelingTrip["mapLevel"]);


            // 각 일정들에 대한 정보(마커, 내용)
            var items = [];
            $.each(currentTravelingTrip["pointsList"], function(index, aPoint) {
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
                        addMarker(value["lat"], value["lng"], "blue", false);
                    }
                });
                anItem += "</li>";

                items.push(anItem);
            });

            $("#pointList").append(items.join(""));
            attachDynamicEventListeners();
        });
    }
}

function changeScreen_mainPage() {
    $("#oneTravelControl").hide();
    $("#pointListDiv").hide();
    $("#newPointControl").hide();
    $("#selectPositionMessage").hide();

    $("#controlTitle").text("여행 List");
    $("#tripListDiv").show();
    $("#travelListControl").show();

    //control버튼들 다시 활성화
    $("#addTripButton").attr("disabled", false);

    getAndShowTripList();
    clearMap();
}

function addMarker(markerLat, markerLng, markerColor, draggable) {
    var imageScr = "",
        imageSize = new kakao.maps.Size(40, 40),
        imageOption = {offset : new kakao.maps.Point(20, 50)};

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

    var markerImage = new kakao.maps.MarkerImage(imageScr, imageSize, imageOption),
        markerPosition = new kakao.maps.LatLng(markerLat, markerLng);

    var newPointMarker = new kakao.maps.Marker({
        position : markerPosition,
        image : markerImage
    });

    newPointMarker.setMap(screenMap);
    newPointMarker.setDraggable(draggable);

    currentShownMarker.push(newPointMarker);

    return newPointMarker;
}