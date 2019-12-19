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

var_dump($pointData);
$fileName = "./"+$tripName+"/"+$pointName+".json"
file_put_contents($fileName, json_encode($pointData));

echo "success";
?>