<?php
// Database connection
$host = "localhost";
$user = "root";
$password = "";
$database = "lms_database";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "⚠️ ডাটাবেস সংযোগ ব্যর্থ!"]));
}

// ফর্ম ডাটা গ্রহণ করা
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$preferredCourse = trim($_POST['preferredCourse']);
$password = trim($_POST['password']);

// ইনপুট ফাঁকা থাকলে ত্রুটি দেখানো
if (empty($name) || empty($email) || empty($preferredCourse) || empty($password)) {
    echo json_encode(["success" => false, "message" => "⚠️ সবগুলো তথ্য পূরণ করুন!"]);
    exit();
}

// ইমেইল ডুপ্লিকেট চেক
$checkQuery = "SELECT * FROM users WHERE email=?";
$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("s", $email);
$stmt->execute();
$checkResult = $stmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "⚠️ এই ইমেইলটি ইতিমধ্যে নিবন্ধিত!"]);
    exit();
}

// পাসওয়ার্ড এনক্রিপশন
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// নতুন ইউজার ইনসার্ট করা
$query = "INSERT INTO users (name, email, preferred_course, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $name, $email, $preferredCourse, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ নিবন্ধন সফল!"]);
} else {
    echo json_encode(["success" => false, "message" => "❌ নিবন্ধন ব্যর্থ হয়েছে!"]);
}

$stmt->close();
$conn->close();
?>
