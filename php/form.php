<?php
// Basic form handler with reCAPTCHA v2 verification and PHPMailer SMTP
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$name    = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email   = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$phone   = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
$consent = filter_input(INPUT_POST, 'consent', FILTER_VALIDATE_BOOLEAN);
$captcha = $_POST['g-recaptcha-response'] ?? '';

if (preg_match('/[\r\n]/', $name . $email)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

if (!$name || !$email || !$message || !$consent) {
    echo json_encode(['success' => false, 'message' => 'Complete all required fields']);
    exit;
}

$secret = '6LdcOq8rAAAAAMfUbQNsUaeHP9YHnA0tovpIH8nr';
$verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . $secret . '&response=' . $captcha);
$response = json_decode($verify);
if (!$response || !$response->success) {
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA failed']);
    exit;
}

try {
    // Uncomment and adjust paths if PHPMailer is installed
    // use PHPMailer\PHPMailer\PHPMailer;
    // use PHPMailer\PHPMailer\Exception;
    // require 'PHPMailer/PHPMailer.php';
    // require 'PHPMailer/SMTP.php';

    $mail = new PHPMailer(true); // assuming PHPMailer is available
    $mail->isSMTP();
    $mail->Host = 'mail.vmasideas.agency';
    $mail->SMTPAuth = true;
    $mail->Username = 'pruebaphp@vmasideas.agency';
    $mail->Password = 'Pruebaphp';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('pruebaphp@vmasideas.agency', 'Web Form');
    $mail->addAddress('pruebaphp@vmasideas.agency');
    $mail->Subject = 'Contacto desde Festivales Náuticos MX';
    $mail->Body    = "Nombre: $name\nEmail: $email\nTeléfono: $phone\nMensaje: $message";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);
} catch (Exception $e) {
    // In production, log the error
    echo json_encode(['success' => false, 'message' => 'Error al enviar el mensaje']);
}
