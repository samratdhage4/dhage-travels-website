-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dhage_travels;
USE dhage_travels;

-- Table for Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    from_city VARCHAR(50) NOT NULL,
    to_city VARCHAR(50) NOT NULL,
    travel_date DATE NOT NULL,
    selected_seats VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_age INT NOT NULL,
    passenger_gender VARCHAR(20) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_email VARCHAR(100),
    payment_method VARCHAR(50) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Feedback
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
