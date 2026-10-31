<?php
/**
 * Indus Kundli App - Backend Authentication & Email Dispatcher
 * Hostinger Linux Shared Hosting Compatible (PHP 7.4 - 8.3+)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

$DATA_DIR = __DIR__ . '/data';
if (!is_dir($DATA_DIR)) {
    @mkdir($DATA_DIR, 0755, true);
}

$DB_FILE =$DATA_DIR . '/users.json';
if (!file_exists($DB_FILE)) {$initial_db = [
        'users' => [
            [
                'id' => 'admin_1',
                'login_id' => 'admin',
                'email' => 'admin@indusjyotish.in',
                'mobile' => '+919811000000',
                'location' => 'Faridabad, Haryana, India',
                'password' => 'indusadmin2026',
                'role' => 'admin',
                'tier' => 'unlimited_3000',
                'max_credits' => 999999,
                'saved_kundlis' => [],
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]
    ];
    file_put_contents($DB_FILE, json_encode($initial_db, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function load_db() {
    global $DB_FILE;
    $raw = @file_get_contents($DB_FILE);
    if ($raw) {
        $parsed = json_decode($raw, true);
        if (is_array($parsed) && isset($parsed['users'])) return$parsed;
    }
    return ['users' => []];
}

function save_db($db) {
    global $DB_FILE;
    @file_put_contents($DB_FILE, json_encode($db, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function get_request_data() {
    $input = file_get_contents('php://input');
    if ($input) {
        $json = json_decode($input, true);
        if (is_array($json)) return$json;
    }
    return $_POST;
}

function send_indus_email($to_email, $subject,$html_body) {
    if (empty($to_email) \vert{}\vert{} !filter_var($to_email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $from_name = "Indus Kundli App";
    $from_email = "noreply@" . (isset($_SERVER['HTTP_HOST']) ? preg_replace('/^www\./', '', $_SERVER['HTTP_HOST']) : 'indusjyotish.in');$headers = [];
    $headers[] = 'MIME-Version: 1.0';$headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' .$from_name . ' <' . $from_email . '>';$headers[] = 'Reply-To: support@indusjyotish.in';
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    return @mail($to_email,$subject, $html_body, implode("\r\n", $headers));
}

$action = isset($_GET['action']) ? trim($_GET['action']) : '';
$data = get_request_data();$db = load_db();

switch ($action) {
    case 'me':
        if (isset($_SESSION['user_id'])) {
            foreach ($db['users'] as$u) {
                if ($u['id'] ===$_SESSION['user_id']) {
                    unset($u['password']);
                    echo json_encode(['authenticated' => true, 'user' => $u]);
                    exit;
                }
            }
        }
        echo json_encode(['authenticated' => false]);
        exit;

    case 'register':
        $login_id = isset($data['login_id']) ? trim($data['login_id']) : '';
        $email = isset($data['email']) ? trim(strtolower($data['email'])) : '';$mobile = isset($data['mobile']) ? trim($data['mobile']) : '';
        $location = isset($data['location']) ? trim($data['location']) : '';$password = isset($data['password']) ? trim($data['password']) : '';

        if (empty($login_id) \vert{}\vert{} empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Login ID and Password are required.']);
            exit;
        }

        foreach ($db['users'] as$u) {
            if (strcasecmp($u['login_id'],$login_id) === 0) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'An account with this Login ID already exists.']);
                exit;
            }
            if (!empty($email) && isset($u['email']) && strcasecmp($u['email'],$email) === 0) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'An account with this Email Address already exists.']);
                exit;
            }
            if (!empty($mobile) && isset($u['mobile']) && $u['mobile'] ===$mobile) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'An account with this Mobile Number already exists.']);
                exit;
            }
        }

        $new_user = [
            'id' => 'usr_' . time() . '_' . mt_rand(100, 999),
            'login_id' => $login_id,
            'email' => $email,
            'mobile' => $mobile,
            'location' => $location,
            'password' => $password,
            'role' => 'user',
            'tier' => 'free',
            'max_credits' => 10,
            'saved_kundlis' => [],
            'created_at' => date('Y-m-d H:i:s')
        ];

        $db['users'][] =$new_user;
        save_db($db);

        $_SESSION['user_id'] =$new_user['id'];

        if (!empty($email)) {$welcome_html = "
            <!DOCTYPE html>
            <html>
            <head><meta charset='utf-8'></head>
            <body style='font-family: Arial, sans-serif; background: #050b18; color: #e2e8f0; padding: 20px;'>
              <div style='max-width: 600px; margin: auto; background: #0f1a30; border: 1px solid #d97706; border-radius: 12px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);'>
                <h2 style='color: #f59e0b; margin-top: 0;'>Welcome to Indus Kundli App</h2>
                <p>Namaste <strong>" . htmlspecialchars($login_id) . "</strong>,</p>
                <p>Your account on <strong>Indus Kundli App</strong> (Indus Jyotish) has been created successfully!</p>
                <div style='background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;'>
                  <p style='margin: 6px 0;'><strong>Login ID:</strong> " . htmlspecialchars($login_id) . "</p>
                  <p style='margin: 6px 0;'><strong>Registered Email:</strong> " . htmlspecialchars($email) . "</p>
                  <p style='margin: 6px 0;'><strong>Mobile Number:</strong> " . htmlspecialchars($mobile) . "</p>
                  <p style='margin: 6px 0;'><strong>Location:</strong> " . htmlspecialchars($location) . "</p>
                  <p style='margin: 6px 0; color: #10b981;'><strong>Active Vault:</strong> 10 Free Saved Kundli Slots</p>
                </div>
                <p>You can now save your personal and family horoscopes, inspect full D1–D60 divisional vargas, calculate Sarvashtakavarga, and generate printouts.</p>
                <p style='text-align: center; margin: 25px 0;'>
                  <a href='https://kundli.indusjyotish.in' style='display: inline-block; background: #f59e0b; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;'>Open Indus Kundli App</a>
                </p>
                <hr style='border: none; border-top: 1px solid #334155; margin: 25px 0;'>
                <p style='font-size: 11px; color: #94a3b8; text-align: center;'>Indus Kundli App • Powered by Indus Jyotish • kundli.indusjyotish.in</p>
              </div>
            </body>
            </html>";
            send_indus_email($email, "Welcome to Indus Kundli App - Account Created Successfully", $welcome_html);
        }

        unset($new_user['password']);
        echo json_encode(['success' => true, 'user' => $new_user, 'message' => 'Account created successfully! Welcome email sent.']);
        exit;

    case 'login':
        $login_id
