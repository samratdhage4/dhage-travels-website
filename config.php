<?php
// Database Configuration
$db_host = 'localhost';
$db_user = 'root'; // default XAMPP user
$db_pass = '';     // default XAMPP password
$db_name = 'dhage_travels';

// Connect to Database
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Twilio Configuration (User needs to fill these)
define('TWILIO_SID', 'YOUR_TWILIO_ACCOUNT_SID');
define('TWILIO_AUTH_TOKEN', 'YOUR_TWILIO_AUTH_TOKEN');
define('TWILIO_PHONE_NUMBER', 'YOUR_TWILIO_PHONE_NUMBER');
define('OWNER_PHONE_NUMBER', '+911234567890'); // Owner's number to receive notifications

/**
 * Function to send SMS via Twilio using cURL
 */
function sendSMS($to, $message) {
    $sid = TWILIO_SID;
    $token = TWILIO_AUTH_TOKEN;
    $from = TWILIO_PHONE_NUMBER;

    if ($sid === 'YOUR_TWILIO_ACCOUNT_SID') return false; // Not configured

    $url = "https://api.twilio.com/2010-04-01/Accounts/$sid/Messages.json";
    
    $data = array(
        'From' => $from,
        'To' => $to,
        'Body' => $message
    );

    $post = http_build_query($data);
    $x = curl_init($url);
    curl_setopt($x, CURLOPT_POST, true);
    curl_setopt($x, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($x, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($x, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($x, CURLOPT_USERPWD, "$sid:$token");
    curl_setopt($x, CURLOPT_POSTFIELDS, $post);
    
    $response = curl_exec($x);
    curl_close($x);
    
    return $response;
}
?>
