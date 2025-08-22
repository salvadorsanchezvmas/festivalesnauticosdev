<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

$name = sanitize($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = sanitize($_POST['phone'] ?? '');
$message = sanitize($_POST['message'] ?? '');
$consent = isset($_POST['consent']);
$recaptcha = $_POST['g-recaptcha-response'] ?? '';

if (!$name || !$email || !$message || !$consent || !$recaptcha) {
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

$secret = 'YOUR_SECRET_KEY'; // Replace with your reCAPTCHA secret key
$verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$recaptcha}");
$responseData = json_decode($verifyResponse, true);

if (!$responseData['success']) {
    echo json_encode(['success' => false, 'message' => 'Captcha verification failed.']);
    exit;
}

// TODO: send email using mail() or PHPMailer
// Example with PHPMailer (placeholder):
// use PHPMailer\PHPMailer\PHPMailer;
// $mail = new PHPMailer();
// ... configure SMTP ...
// $mail->setFrom($email, $name);
// $mail->addAddress('you@example.com');
// $mail->Subject = 'Nuevo mensaje de contacto';
// $mail->Body = $message;
// $mail->send();

echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
