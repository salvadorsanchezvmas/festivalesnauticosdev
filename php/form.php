<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

function clean_input($value) {
    return trim(strip_tags($value));
}

$name = clean_input($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = clean_input($_POST['phone'] ?? '');
$message = clean_input($_POST['message'] ?? '');
$consent = isset($_POST['consent']);
$recaptcha = $_POST['g-recaptcha-response'] ?? '';

if (!$name || !$email || !$phone || !$message || !$consent) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$secret = '6LdcOq8rAAAAAMfUbQNsUaeHP9YHnA0tovpIH8nr';
$verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . $secret . '&response=' . $recaptcha);
$responseData = json_decode($verifyResponse, true);
if (empty($responseData['success'])) {
    echo json_encode(['success' => false, 'message' => 'Captcha inválido']);
    exit;
}

$to = 'info@festivalesnauticos.com'; // cambiar por email real
$subject = 'Nuevo mensaje del formulario';
$body = "Nombre: $name\nEmail: $email\nTel: $phone\nMensaje: $message";
$headers = 'From: ' . $email . "\r\n";

if (@mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Enviado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al enviar']);
}

/*
// Enviar con PHPMailer (SMTP)
// require 'PHPMailer/PHPMailer.php';
// require 'PHPMailer/SMTP.php';
// $mail = new PHPMailer();
// $mail->isSMTP();
// $mail->Host = 'mail.vmasideas.agency';
// $mail->SMTPAuth = true;
// $mail->Username = 'pruebaphp@vmasideas.agency';
// $mail->Password = 'Pruebaphp';
// $mail->SMTPSecure = 'ssl';
// $mail->Port = 465;
*/
?>
