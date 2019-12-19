<?php
$tripName = $_POST["tripName"];
$pointName = $_POST["pointName"];
$pointDate = $_POST["pointDate"];
$pointDescription = $_POST["pointDescription"];
$pointLat = $_POST["lat"];
$pointLng = $_POST["lng"];

$pointData = array(
    "pointName" => $pointName,
    "date" => $pointDate,
    "description" => $pointDescription,
    "pointLocation" => array("lat" => (double) $pointLat, "lng" => (double) $pointLng)
);

$fileName = "./data/".$tripName."/".$pointName.".json";
var_dump($pointData,$fileName);
var_dump(json_encode($pointData));
file_put_contents($fileName, json_encode($pointData));

$fileName = "./data/".$tripName."/".$tripName.+"_summary.json";
$tripSummaryJSON = file_get_contents($fileName);
$tripSummaryArray = json_decode($tripSummaryJSON, true);

array_push($tripSummaryArray["pointsOrder"], $pointName);

file_put_contents($fileName, json_encode($tripSummaryArray, JSON_UNESCAPED_UNICODE))



echo "success";
?>