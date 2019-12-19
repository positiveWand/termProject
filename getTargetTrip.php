<?php
$targetTripTitle = $_POST["targetTrip"];

$summaryJson = file_get_contents("./data/".$targetTripTitle."/".$targetTripTitle+"_summary.json");
$summaryArray = json_decode($summaryJson);

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
    $pointJson = file_get_contents("./data/".$targetTripTitle."/".$targetPoint+".json");
    array_push($packageArray["pointsList"], json_decode($pointJson));
}

var_dump($packageArray);

echo json_encode($packageArray);
?>