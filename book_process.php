<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'No data received']);
        exit;
    }

    $bus_name = $conn->real_escape_string($data['bus_name']);
    $from_city = $conn->real_escape_string($data['from_city']);
    $to_city = $conn->real_escape_string($data['to_city']);
    $travel_date = $conn->real_escape_string($data['travel_date']);
    $selected_seats = $conn->real_escape_string($data['selected_seats']);
    $total_amount = (float)$data['total_amount'];
    $passenger_name = $conn->real_escape_string($data['passenger_name']);
    $passenger_age = (int)$data['passenger_age'];
    $passenger_gender = $conn->real_escape_string($data['passenger_gender']);
    $passenger_phone = $conn->real_escape_string($data['passenger_phone']);
    $passenger_email = $conn->real_escape_string($data['passenger_email']);
    $payment_method = $conn->real_escape_string($data['payment_method']);

    $query = "INSERT INTO bookings (bus_name, from_city, to_city, travel_date, selected_seats, total_amount, passenger_name, passenger_age, passenger_gender, passenger_phone, passenger_email, payment_method) 
              VALUES ('$bus_name', '$from_city', '$to_city', '$travel_date', '$selected_seats', $total_amount, '$passenger_name', $passenger_age, '$passenger_gender', '$passenger_phone', '$passenger_email', '$payment_method')";

    if ($conn->query($query)) {
        // Send SMS Notification to Owner
        $sms_message = "New Booking Alert!\nBus: $bus_name\nRoute: $from_city to $to_city\nDate: $travel_date\nSeats: $selected_seats\nPassenger: $passenger_name ($passenger_phone)\nAmount: ₹$total_amount";
        
        sendSMS(OWNER_PHONE_NUMBER, $sms_message);

        echo json_encode(['success' => true, 'message' => 'Booking saved successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
