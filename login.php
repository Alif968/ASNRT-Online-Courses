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

// ইউজারের ইনপুট নেওয়া
$email = trim($_POST['email']);
$password = trim($_POST['password']);

// ইনপুট চেক
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "⚠️ ইমেইল এবং পাসওয়ার্ড দিন!"]);
    exit();
}

// ইমেইল অনুযায়ী ইউজার খোঁজা
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // পাসওয়ার্ড যাচাই
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "✅ লগইন সফল!",
            "user" => [
                "name" => $user['name'],
                "email" => $user['email'],
                "preferredCourse" => $user['preferred_course']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "❌ ভুল পাসওয়ার্ড!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "❌ এই ইমেইলের কোনো ইউজার নেই! ইউজার হতে রেজিস্ট্রেশন করুন!"]);
}

// সংযোগ বন্ধ
$stmt->close();
$conn->close();
?>
