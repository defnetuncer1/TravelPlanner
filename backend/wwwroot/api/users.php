<?php
header("Content-Type: application/json");
include "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"), true);

if ($method == "POST") {

    $action = $data["action"];

    if ($action == "register") {
        $stmt = $db->prepare("INSERT INTO Users (FullName, Email, Password)
                              VALUES (:fullName, :email, :password)");

        $stmt->bindValue(":fullName", $data["fullName"], SQLITE3_TEXT);
        $stmt->bindValue(":email", $data["email"], SQLITE3_TEXT);
        $stmt->bindValue(":password", $data["password"], SQLITE3_TEXT);

        $result = $stmt->execute();

        if ($result) {
            echo json_encode(["success" => true, "message" => "Registration successful."]);
        } else {
            echo json_encode(["success" => false, "message" => "Registration failed. Email may already exist."]);
        }
    }

    if ($action == "login") {
        $stmt = $db->prepare("SELECT * FROM Users WHERE Email = :email AND Password = :password");

        $stmt->bindValue(":email", $data["email"], SQLITE3_TEXT);
        $stmt->bindValue(":password", $data["password"], SQLITE3_TEXT);

        $result = $stmt->execute();
        $user = $result->fetchArray(SQLITE3_ASSOC);

        if ($user) {
            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "fullName" => $user["FullName"],
                "email" => $user["Email"]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Invalid email or password."
            ]);
        }
    }
}
?>