<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);

// 요청된 여행 이름에 대한 정보를 찾아 반환해주는 파일

$targetTripTitle = $_POST["targetTrip"]; //요청된 여행 이름
$targetFile = "./data/".$targetTripTitle."/".$targetTripTitle."_summary.json"; //파일 읽기
$summaryJson = file_get_contents($targetFile);
$summaryArray = json_decode($summaryJson, true);

// 문자열을 파상하여 JSON형식으로 정리하여 전달
$packageArray = array(
    "title" => $summaryArray["title"],
    "startDate" => $summaryArray["startDate"],
    "endDate" => $summaryArray["endDate"],
    "description" => $summaryArray["description"],
    "mapCenter" => $summaryArray["mapCenter"],
    "mapLevel" => $summaryArray["mapLevel"],
    "pointsList" => array()
);

for($i = 0; $i < count($summaryArray["pointsOrder"]); $i++) {
    $targetPoint = $summaryArray["pointsOrder"][$i];
    $targetFile = "./data/".$targetTripTitle."/".$targetPoint.".json";
    $pointJson = file_get_contents($targetFile);
    array_push($packageArray["pointsList"], json_decode($pointJson, true));
}




echo json_encode($packageArray);



?>