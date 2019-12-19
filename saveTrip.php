<?php
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
    "mapCenter" => array("lat" => $mapLat, "lng" => "mapLng"),
    "mapLevel" => $mapLevel
);
?>