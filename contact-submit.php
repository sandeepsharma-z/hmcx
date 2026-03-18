<?php
declare(strict_types=1);
require_once __DIR__ . '/admin/lib.php';

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$company = trim((string)($_POST['company'] ?? ''));
$country = trim((string)($_POST['country'] ?? ''));
$service = trim((string)($_POST['service'] ?? ''));
$budget = trim((string)($_POST['budget'] ?? ''));
$timeline = trim((string)($_POST['timeline'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$ipAddress = (string)($_SERVER['REMOTE_ADDR'] ?? '');
$userAgent = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500);

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

if (strlen($name) > 120 || strlen($email) > 190 || strlen($phone) > 40 || strlen($company) > 160 || strlen($country) > 120 || strlen($service) > 120 || strlen($budget) > 120 || strlen($timeline) > 120 || strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Input is too long. Please shorten details and try again.']);
    exit;
}

try {
    hmcx_save_submission([
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'company' => $company,
        'country' => $country,
        'service' => $service,
        'budget' => $budget,
        'timeline' => $timeline,
        'message' => $message,
        'ip_address' => $ipAddress,
        'user_agent' => $userAgent,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server could not save your request. Please try again.',
    ]);
    exit;
}

$to = 'sandeepsharma909909@gmail.com';
$subject = 'New Contact Form Inquiry - ' . $name;

$body = implode("\n", [
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Company: ' . ($company !== '' ? $company : 'Not provided'),
    'Country: ' . ($country !== '' ? $country : 'Not provided'),
    'Service: ' . ($service !== '' ? $service : 'Not selected'),
    'Budget: ' . ($budget !== '' ? $budget : 'Not selected'),
    'Timeline: ' . ($timeline !== '' ? $timeline : 'Not selected'),
    '',
    'Project Details:',
    $message,
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: HmcxStudio Website <no-reply@hmcxstudio.com>',
    'Reply-To: ' . $email,
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message saved successfully. Email relay is currently unavailable on server.',
    ]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
