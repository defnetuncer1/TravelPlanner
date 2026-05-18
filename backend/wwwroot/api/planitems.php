<?php
header("Content-Type: application/json");
include "db.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $db->prepare("INSERT INTO PlanItems (PlanID, PlaceID, Note)
                          VALUES (:planID, :placeID, :note)");

    $stmt->bindValue(":planID", $data["planID"], SQLITE3_INTEGER);
    $stmt->bindValue(":placeID", $data["placeID"], SQLITE3_INTEGER);
    $stmt->bindValue(":note", "", SQLITE3_TEXT);

    $stmt->execute();

    echo json_encode(["message" => "Place added to plan"]);
}

if ($method == "GET") {

    $planID = $_GET["planID"];

    $result = $db->query("
        SELECT Places.*
        FROM PlanItems
        JOIN Places ON PlanItems.PlaceID = Places.PlaceID
        WHERE PlanItems.PlanID = $planID
    ");

    $places = [];

    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $places[] = $row;
    }

    echo json_encode($places);
}

if ($method == "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $db->prepare("DELETE FROM PlanItems WHERE PlanID = :planID AND PlaceID = :placeID");

    $stmt->bindValue(":planID", $data["planID"], SQLITE3_INTEGER);
    $stmt->bindValue(":placeID", $data["placeID"], SQLITE3_INTEGER);

    $stmt->execute();

    echo json_encode(["message" => "Place removed from plan"]);
}
?>