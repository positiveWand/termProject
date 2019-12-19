<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);
// 전달된 일정에 대한 정보를 저장하는 파일


//전달된 정보
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

// 일정 파일을 수정, 저장
$fileName = "./data/".$tripName."/".$pointName.".json";
var_dump($pointData,$fileName);
var_dump(json_encode($pointData));
file_put_contents($fileName, json_encode($pointData));

// 여행 파일을 수정, 저장
$fileName = "./data/".$tripName."/".$tripName."_summary.json";
$tripSummaryJSON = file_get_contents($fileName);
$tripSummaryArray = json_decode($tripSummaryJSON, true);

array_push($tripSummaryArray["pointsOrder"], $pointName);
var_dump($tripSummaryArray);

file_put_contents($fileName, json_encode($tripSummaryArray));

// 전체 여행 파일을 수정, 저장
$fileName = "./data/all_trips_summary.json";
$allTripsSummaryJSON = file_get_contents($fileName);
$allTripsSummaryArray = json_decode($allTripsSummaryJSON, true);

for($i = 0; $i < count($allTripsSummaryArray); $i++) {
    if($allTripsSummaryArray[$i]["title"] == $tripName) {
        array_push($allTripsSummaryArray[$i]["mainPoints"], array("lat" => $pointLat, "lng" => $pointLng));
        break;
    }
}

file_put_contents($fileName, json_encode($allTripsSummaryArray));



echo "success";
?>