<?php
$targetFile = "./data/all_trips_summary.json";
$tripsJSON = file_get_contents($targetFile);
$tripsList = json_decode($tripsJSON, true);

$allTrips = [];

for($i = 0; $i < count($tripsList); $i++) {
    $targetFile = "./data/".$tripsList[$i]."/".$tripsList[$i]."_summary.json";

    $aTripJSON = file_get_contents($targetFile);
    $aTripArray = json_decode($aTripJSON, true);

    $pointsList = $aTripArray["pointsOrder"];
    $pointLocationList = [];
    for($j = 0; $j < count($pointsList); $j++) {
        $aPointName = $pointsList[$j];

        $targetFile = "./data/".$tripsList[$i]."/".$aPointName.".json";
        $pointJSON = file_get_contents($targetFile);
        $pointArray = json_decode($aPointName, true);

        array_push($pointLocationList, $pointArray["pointLocation"]);

    }
}

echo 
?>