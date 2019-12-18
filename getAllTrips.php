<?php
$summaryJson = json_decode(file_get_contents("get_trips_summary.json"), true);
var_dump($summaryJson);
$summaryJson["trips"]
?>