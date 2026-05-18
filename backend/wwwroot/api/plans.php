<?php
header("Content-Type: application/json");
include "db.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method == "GET") {
    $result = $db->query("SELECT * FROM Plans");
    $plans = [];

    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $plans[] = [
            "planID" => $row["PlanID"],
            "userID" => $row["UserID"],
            "planName" => $row["PlanName"],
            "destinationCity" => $row["DestinationCity"],
            "startDate" => $row["StartDate"],
            "endDate" => $row["EndDate"]
        ];
    }

    echo json_encode($plans);
}

if ($method == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $db->prepare("INSERT INTO Plans (UserID, PlanName, DestinationCity, StartDate, EndDate)
                          VALUES (:userID, :planName, :destinationCity, :startDate, :endDate)");

    $stmt->bindValue(":userID", $data["userID"], SQLITE3_INTEGER);
    $stmt->bindValue(":planName", $data["planName"], SQLITE3_TEXT);
    $stmt->bindValue(":destinationCity", $data["destinationCity"], SQLITE3_TEXT);
    $stmt->bindValue(":startDate", $data["startDate"], SQLITE3_TEXT);
    $stmt->bindValue(":endDate", $data["endDate"], SQLITE3_TEXT);

    $stmt->execute();

    echo json_encode(["message" => "Plan created successfully"]);
}

if ($method == "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $db->prepare("UPDATE Plans 
                          SET PlanName = :planName,
                              DestinationCity = :destinationCity,
                              StartDate = :startDate,
                              EndDate = :endDate
                          WHERE PlanID = :planID");

    $stmt->bindValue(":planID", $data["planID"], SQLITE3_INTEGER);
    $stmt->bindValue(":planName", $data["planName"], SQLITE3_TEXT);
    $stmt->bindValue(":destinationCity", $data["destinationCity"], SQLITE3_TEXT);
    $stmt->bindValue(":startDate", $data["startDate"], SQLITE3_TEXT);
    $stmt->bindValue(":endDate", $data["endDate"], SQLITE3_TEXT);

    $stmt->execute();

    echo json_encode(["message" => "Plan updated successfully"]);
}

if ($method == "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $db->prepare("DELETE FROM Plans WHERE PlanID = :planID");
    $stmt->bindValue(":planID", $data["planID"], SQLITE3_INTEGER);
    $stmt->execute();

    echo json_encode(["message" => "Plan deleted successfully"]);
}
?>