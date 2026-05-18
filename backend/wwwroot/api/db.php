<?php
$db = new SQLite3(__DIR__ . "/travelplanner.db");

$db->exec("CREATE TABLE IF NOT EXISTS Places (
    PlaceID INTEGER PRIMARY KEY AUTOINCREMENT,
    PlaceName TEXT NOT NULL,
    City TEXT NOT NULL,
    Country TEXT NOT NULL,
    Category TEXT NOT NULL,
    Description TEXT NOT NULL,
    EstimatedCost REAL,
    Currency TEXT,
    Rating REAL,
    ImagePath TEXT
)");

$checkPlaces = $db->querySingle("SELECT COUNT(*) FROM Places");

if ($checkPlaces == 0) {
    $db->exec("INSERT INTO Places 
        (PlaceName, City, Country, Category, Description, EstimatedCost, Currency, Rating, ImagePath)
        VALUES
        ('Sky Garden', 'London', 'United Kingdom', 'Attraction', 'A popular viewpoint and indoor garden in London.', 0, 'GBP', 4.6, '../images/london.jpeg'),
        ('Louvre Museum', 'Paris', 'France', 'Museum', 'A world-famous museum for art, history and culture lovers.', 17, 'EUR', 4.8, '../images/louvre.jpeg'),
        ('Shibuya Crossing', 'Tokyo', 'Japan', 'Attraction', 'One of Tokyo''s most iconic and energetic city spots.', 0, 'JPY', 4.7, '../images/tokyo.jpeg')
    ");
}

$db->exec("CREATE TABLE IF NOT EXISTS Plans (
    PlanID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER,
    PlanName TEXT NOT NULL,
    DestinationCity TEXT NOT NULL,
    StartDate TEXT NOT NULL,
    EndDate TEXT NOT NULL
)");

$db->exec("CREATE TABLE IF NOT EXISTS PlanItems (
    PlanItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    PlanID INTEGER,
    PlaceID INTEGER,
    Note TEXT
)");

$db->exec("CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
)");

?>
