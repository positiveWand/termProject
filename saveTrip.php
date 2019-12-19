<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);
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

$fileName = "./data/all_trips_summary.json";
$allTripsSummaryJSON = file_get_contents($fileName);
$allTripsSummaryArray = json_decode($allTripsSummaryJSON, true);
$mainPointList = [];

for($i = 0; $i < count($allTripsSummaryArray); $i++) {
    if($allTripsSummaryArray[$i]["title"] == $tripName) {
        $mainPointList = $allTripsSummaryArray[$i]["mainPoints"];
        array_splice($allTripsSummaryArray, $i, $i);
        var_dump($allTripsSummaryArray);
    }
}

$tripData["mainPoints"] = $mainPointList;
var_dump($allTripsSummaryArray);
array_push($allTripsSummaryArray, $tripData);
var_dump($allTripsSummaryArray);

file_put_contents($fileName, json_encode($allTripsSummaryArray));

if($newTrip == "true") {
    mkdir("./data/".$tripName);
} 
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