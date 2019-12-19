<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);

$targetTripTitle = $_POST["targetTrip"];
var_dump($targetTripTitle);
$targetFile = "./data/".$targetTripTitle."/".$targetTripTitle."_summary.json";
$summaryJson = file_get_contents($targetFile);
var_dump($summaryJson);
$summaryArray = json_decode($summaryJson, true);

var_dump($summaryArray);


$packageArray = array(
    "title" => $summaryArray["title"],
    "startDate" => $summaryArray["startDate"],
    "endDate" => $summaryArray["endDate"],
    "description" => $summaryArray["description"],
    "mapCenter" => $summaryArray["mapCenter"],
    "mapLevel" => $summaryArray["mapLevel"],
    "pointsList" => array()
);
var_dump($packageArray);
var_dump($summaryArray["pointsOrder"][0]);
/*
for($i = 0; $i < count($summaryArray["pointsOrder"]); $i++) {
    $targetPoint = $summaryArray["pointsOrder"][$i];
    $targetFile = "./data/".$targetTripTitle."/".$targetPoint.".json";
    var_dump($targetFile);
    $pointJson = file_get_contents($targetFile);
    array_push($packageArray["pointsList"], json_decode($pointJson, true));
}



var_dump($packageArray);

echo json_encode($packageArray);
*/


?>