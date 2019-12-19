<?php
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