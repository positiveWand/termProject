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



echo "success";
?>