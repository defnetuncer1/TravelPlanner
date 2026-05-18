<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

header("Content-Type: application/json");
include "db.php";

$result = $db->query("SELECT * FROM Places");

$places = [];

while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $places[] = [
        "placeID" => $row["PlaceID"],
        "placeName" => $row["PlaceName"],
        "city" => $row["City"],
        "country" => $row["Country"],
        "category" => $row["Category"],
        "description" => $row["Description"],
        "estimatedCost" => $row["EstimatedCost"],
        "currency" => $row["Currency"],
        "rating" => $row["Rating"],
        "imagePath" => $row["ImagePath"]
    ];
}

echo json_encode($places);
?>