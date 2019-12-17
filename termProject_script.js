
var screenMap;

var addedTrip_map_center = [];
var addedTrip_map_level = 0;

var receivedTripList = null; //서버로부터 전달받은 여행 "전체"
var current_shownTripList = null; //현재 화면에 보여지고 있는 여행들
var tripSelected = false;
var selectedTripName = "";
var selectedTripDatetime = "";

$(document).ready(function() {
    readyMap();

    $(".emptyListMessage").hide();
    $("#selectPositionMessage").hide();
    $("#oneTravelControl").hide();

    //서버로부터 여행목록 가져오기
    $("#alignButton").on("click", function() {
        /*
        -대상 : 전체 목록
        -사용자가 설정한 방식대로 전체 리스트를 정렬한다
        1) 제목 순 : 여행의 "제목"을 기준으로 정렬
        2) 날짜 순 : 여행의 "시간(Datetime)"을 기준으로 정렬
        */
        var alignType = $("selectAlign").val();

        if(alignType == "byTitle") {

        }
        else if(alignType == "byDate") {

        }
    });
    $("#searchTripButton").on("click", function() {
        /*
        -대상 : 전체 목록
        -사용자가 입력한 검색어로 제목이 일치하는 여행을 찾아 제시한다
        */
    });
    $("#addTripButton").on("click", function(){
        /*
        *<화면 전환>
        *-지도의 초기 위치(여행의 시작 위치)를 설정하도록함
        *-설정 후에 여행 편집 컨트롤로 넘어감
        */

        //지도 초기 위치 설정 화면
        //content내용 전환
        $("#tripListDiv").hide(700);
        $("#selectPositionMessage").show();
        //control버튼들 비활성화
        $("#selectAlign").attr("disabled", true);
        $("#alignButton").attr("disabled", true);
        $("#searchText").attr("disabled", true);
        $("#searchTripButton").attr("disabled", true);
        $("#addTripButton").attr("disabled", true);
    });

    $("#backToMainButton").on("click", function() {
        changeScreen_mainPage();
    });


    $("#tripList li").on("click", function(event) {
        $("#tripList li").css("background-color", "rgb(61, 138, 238)");
        if($(this).find("span[class='peekTitle']").text() != selectedTripName) {
            $(this).css("background-color", "rgb(43, 98, 170)");
            tripSelected = true;
            selectedTripName = $(this).find("span[class='peekTitle']").text();
            //selectedTripDatetime = 
            //showTrip(selectedTripName);
        }
        else {
            tripSelected = false;
            selectedTripName = "";
            selectedTripDatetime = 0;
        }
    });


    $(".accordion").on("click", function() {
        $(this).next().toggle(700);
        if($(this).attr("class") == "accordion") {
            $(this).attr("class", "accordion buttonActive");
        }
        else {
            $(this).attr("class", "accordion");
        }
    });

    $("#thisPlaceButton").on("click", function() {
        //확인 메세지 출력
        //만약 선택됐다면 다음 화면으로 넘어감
        //컨트롤 화면 바뀜
        var continueAdd = confirm("이 위치에서 여행을 시작할까요?");
        if(continueAdd) {
            addedTrip_map_center = screenMap.getCenter();
            addedTrip_map_level = screenMap.getLevel();

            changeScreen_oneTrip();

        }
    });
    $("#addTripCancel").on("click", function() {
        /*
        *<화면 전환>
        *-"여행 추가하기"를 취소함
        *-초기화면으로 돌아간다
        */

        //control버튼들 다시 활성화
        $("#selectAlign").attr("disabled", false);
        $("#alignButton").attr("disabled", false);
        $("#searchText").attr("disabled", false);
        $("#searchTripButton").attr("disabled", false);
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
}

function changeScreen_oneTrip() {
    $("#tripListDiv").hide();
    $("#selectPositionMessage").hide();
    $("#travelListControl").hide();

    $("#controlTitle").text("~여행 중~");
    $("#oneTravelControl").show();
}

function changeScreen_mainPage() {
    $("#oneTravelControl").hide();

    $("#controlTitle").text("여행 List");
    $("#tripListDiv").show();
    $("#travelListControl").show();

    //control버튼들 다시 활성화
    $("#selectAlign").attr("disabled", false);
    $("#alignButton").attr("disabled", false);
    $("#searchText").attr("disabled", false);
    $("#searchTripButton").attr("disabled", false);
    $("#addTripButton").attr("disabled", false);
}