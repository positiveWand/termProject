var receivedTripList = null; //서버로부터 전달받은 여행 "전체"
var current_shownTripList = null; //현재 화면에 보여지고 있는 여행들
alert("ㅎㅇ");
var tripSelected = false;
var selectedTripName = "";
var selectedTripDatetime = "";

$(document).ready(function() {
    alert("dfdf");
    $("#emptyListMessage").hide();
    $("#selectPositionMessage").hide();

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

    $("#tripList li").on("click", function(event) {
        //alert("hello");
        $("#tripList li").css("background-color", "white");
        if($(this).find("span[class='peekTitle']").text() != selectedTripName) {
            $(this).css("background-color", "rgb(61, 138, 238)");
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