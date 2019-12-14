$(document).ready(function() {
    $("#selectPositionMessage").hide();

    $("#addTripCancel").on("click", function() {
        $("#selectAlign").attr("disabled", false);
        $("#alignButton").attr("disabled", false);
        $("#searchText").attr("disabled", false);
        $("#serachTripButton").attr("disabled", false);
        $("#addTripButton").attr("disabled", false);

        $("#selectPositionMessage").hide();
        $("#tripList").show(800);
    });

    $("#addTripButton").on("click", function(){
        /*
        <화면 전환>
        -지도의 초기 위치(여행의 시작 위치)를 설정하도록함
        -설정 후에 여행 편집 컨트롤로 넘어감
        */

        //지도 초기 위치 설정 화면
        //content내용 전환
        $("#tripList").hide(800);
        $("#selectPositionMessage").show();
        //control버튼들 비활성화
        $("#selectAlign").attr("disabled", true);
        $("#alignButton").attr("disabled", true);
        $("#searchText").attr("disabled", true);
        $("#serachTripButton").attr("disabled", true);
        $("#addTripButton").attr("disabled", true);
    });

});