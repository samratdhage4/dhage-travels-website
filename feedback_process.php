<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'No data received']);
        exit;
    }

    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $phone = $conn->real_escape_string($data['phone']);
    $subject = $conn->real_escape_string($data['subject']);
    $message = $conn->real_escape_string($data['message']);

    $query = "INSERT INTO feedback (name, email, phone, subject, message) 
              VALUES ('$name', '$email', '$phone', '$subject', '$message')";

    if ($conn->query($query)) {
        echo json_encode(['success' => true, 'message' => 'Feedback submitted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
