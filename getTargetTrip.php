<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);
[출처] php 500 에러 internal Server Error 내용 확인하기|작성자 이미경
$targetTripTitle = $_POST["targetTrip"];
var_dump($targetTripTitle);
$targetFile = "./data/".$targetTripTitle."/".$targetTripTitle."_summary.json";
$summaryJson = file_get_contents($targetFile);
var_dump($summaryJson);
$summaryArray = json_decode($summaryJson);

var_dump($summaryArray);
var_dump($summaryArray["title"]);
/*
$packageArray = array(
    "title" => $summaryArray["title"],
    "startDate" => $summaryArray["startDate"],
    "endDate" => $summaryArray["endDate"],
    "description" => $summaryArray["description"],
    "mapCenter" => $summaryArray["mapCenter"],
    "mapLevel" => $summaryArray["mapLevel"],
    "pointsList" => array()
);
var_dump($packageArray)

for($i = 0; $i < count($summaryArray["pointsOrder"]); $i++) {
    $targetPoint = $summaryArray["pointsOrder"][$i];
    $targetFile = "./data/".$targetTripTitle."/".$targetPoint.".json";
    $pointJson = file_get_contents($targetFile);
    array_push($packageArray["pointsList"], json_decode($pointJson));
}


var_dump($packageArray);

echo json_encode($packageArray);
*/

?>