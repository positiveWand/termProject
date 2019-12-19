<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);

// 전달된 여행 정보를 저장하는 파일

// 전달된 정보들
$newTrip = $_POST["newTrip"];
$tripName = $_POST["tripName"];
$tripStartDate = $_POST["tripStartDate"];
$tripEndDate = $_POST["tripEndDate"];
$tripDescription = $_POST["tripDescription"];
$mapLat = $_POST["mapLat"];
$mapLng = $_POST["mapLng"];
$mapLevel = $_POST["mapLevel"];

$tripData = array(
    "title" => $tripName,
    "startDate" => $tripStartDate,
    "endDate" => $tripEndDate,
    "mapCenter" => array("lat" => $mapLat, "lng" => $mapLng),
    "mapLevel" => $mapLevel,
    "mainPoints" => array()
);

// 전체 여행 정보 저장하는 파일(all_trips_summary.json) 수정
$fileName = "./data/all_trips_summary.json";
$allTripsSummaryJSON = file_get_contents($fileName);
$allTripsSummaryArray = json_decode($allTripsSummaryJSON, true);
$mainPointList = [];

for($i = 0; $i < count($allTripsSummaryArray); $i++) {
    if($allTripsSummaryArray[$i]["title"] == $tripName) {
        $mainPointList = $allTripsSummaryArray[$i]["mainPoints"];
        array_splice($allTripsSummaryArray, $i, 1);
        var_dump($allTripsSummaryArray);
    }
}

$tripData["mainPoints"] = $mainPointList;
var_dump($allTripsSummaryArray);
array_push($allTripsSummaryArray, $tripData);
var_dump($allTripsSummaryArray);

file_put_contents($fileName, json_encode($allTripsSummaryArray));

// 여행별로 마련된 디렉토리에 있는 정보들 갱신
if($newTrip == "true") { //새로운 여행이라면
    mkdir("./data/".$tripName); //디렉토리 생성
}
// 여행 정보 갱신
$fileName = "./data/".$tripName."/".$tripName."_summary.json";
$tripSummaryJSON = file_get_contents($fileName);
$tripSummaryArray = json_decode($tripSummaryJSON, true);

$tripSummaryArray["title"] = $tripName;
$tripSummaryArray["startDate"] = $tripStartDate;
$tripSummaryArray["endDate"] = $tripEndDate;
$tripSummaryArray["description"] = $tripDescription;
$tripSummaryArray["mapCenter"] = array("lat" => $mapLat, "lng" => $mapLng);
$tripSummaryArray["mapLevel"] = $mapLevel;
if($newTrip == "true") {
    $tripSummaryArray["pointsOrder"] = array();
}

file_put_contents($fileName, json_encode($tripSummaryArray));



?>