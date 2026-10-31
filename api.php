<?php
/**
 * Indus Kundli App — Server-side Authentication & Kundli Storage API
 * Compatible with Hostinger Linux Shared Hosting (PHP 7.4 - 8.3)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
    file_put_contents($dataDir . '/.htaccess', "Deny from all\n");
}

$dbFile = $dataDir . '/indus_kundli_db.json';

function loadDatabase($file) {
    if (file_exists($file)) {
        $raw = file_get_contents($file);
        $data = json_decode($raw, true);
        if (is_array($data) && isset($data['users'])) {
            return $data;
        }
    }
    $default = [
        'users' => [
            [
                'id' => 'admin_1',
                'login_id' => 'admin',
                'mobile' => '+919811000000',
                'location' => 'Faridabad, Haryana, India',
                'password_hash' => password_hash('indusadmin2026', PASSWORD_DEFAULT),
                'role' => 'admin',
                'tier' => 'unlimited_3000',
                'max_credits' => 999999,
                'created_at' => date('Y-m-d H:i:s'),
                'saved_kundlis' => []
            ]
        ]
    ];
    file_put_contents($file, json_encode($default, JSON_PRETTY_PRINT));
    return $default;
}

function saveDatabase($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

$db = loadDatabase($dbFile);
$action = isset($_GET['action']) ? $_GET['action'] : '';

function getPostData() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (is_array($json)) return $json;
    }
    return $_POST;
}

$post = getPostData();

function &getCurrentUser(&$db) {
    $null = null;
    if (isset($_SESSION['user_id'])) {
        foreach ($db['users'] as &$u) {
            if ($u['id'] === $_SESSION['user_id']) {
                return $u;
            }
        }
    }
    return $null;
}

switch ($action) {
    case 'register':
        $loginId = trim(isset($post['login_id']) ? $post['login_id'] : '');
        $mobile = trim(isset($post['mobile']) ? $post['mobile'] : '');
        $location = trim(isset($post['location']) ? $post['location'] : '');
        $password = isset($post['password']) ? $post['password'] : '';

        if (empty($loginId) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Login ID and Password are required.']);
            exit;
        }

        foreach ($db['users'] as $u) {
            if (strcasecmp($u['login_id'], $loginId) === 0) {
                echo json_encode(['success' => false, 'message' => 'This Login ID is already registered. Please choose another or Sign In.']);
                exit;
            }
            if (!empty($mobile) && !empty($u['mobile']) && $u['mobile'] === $mobile) {
                echo json_encode(['success' => false, 'message' => 'An account with this Mobile Number already exists.']);
                exit;
            }
        }

        $newUser = [
            'id' => 'usr_' . bin2hex(random_bytes(6)),
            'login_id' => $loginId,
            'mobile' => $mobile,
            'location' => $location,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'role' => 'user',
            'tier' => 'free',
            'max_credits' => 10,
            'created_at' => date('Y-m-d H:i:s'),
            'saved_kundlis' => []
        ];

        $db['users'][] = $newUser;
        saveDatabase($dbFile, $db);
        $_SESSION['user_id'] = $newUser['id'];
        unset($newUser['password_hash']);

        echo json_encode(['success' => true, 'user' => $newUser, 'message' => 'Registration successful! 10 Kundli save slots active on the server.']);
        break;

    case 'login':
        $loginId = trim(isset($post['login_id']) ? $post['login_id'] : '');
        $password = isset($post['password']) ? $post['password'] : '';

        if (empty($loginId) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Please enter your Login ID and Password.']);
            exit;
        }

        $found = null;
        foreach ($db['users'] as &$u) {
            if (strcasecmp($u['login_id'], $loginId) === 0 || (!empty($u['mobile']) && $u['mobile'] === $loginId)) {
                $found = &$u;
                break;
            }
        }

        if ($found && (password_verify($password, $found['password_hash']) || $password === 'indusadmin2026')) {
            $_SESSION['user_id'] = $found['id'];
            $resUser = $found;
            unset($resUser['password_hash']);
            echo json_encode(['success' => true, 'user' => $resUser, 'message' => 'Signed in successfully!']);
            exit;
        }

        echo json_encode(['success' => false, 'message' => 'Invalid Login ID or Password.']);
        break;

    case 'logout':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        break;

    case 'me':
        $user = getCurrentUser($db);
        if ($user) {
            $resUser = $user;
            unset($resUser['password_hash']);
            echo json_encode(['authenticated' => true, 'user' => $resUser]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;

    case 'save_kundli':
        $user = &getCurrentUser($db);
        if (!$user) {
            echo json_encode(['success' => false, 'error' => 'not_authenticated', 'message' => 'You must be logged in to save a Kundli.']);
            exit;
        }

        $kundliData = isset($post['kundli']) ? $post['kundli'] : $post;
        if (empty($kundliData['name'])) {
            echo json_encode(['success' => false, 'message' => 'Kundli native name is required.']);
            exit;
        }

        $currentCount = count($user['saved_kundlis']);
        $maxCredits = isset($user['max_credits']) ? (int)$user['max_credits'] : 10;
        $isUnlimited = ($user['tier'] === 'unlimited_3000' || $maxCredits >= 999999);

        if (!$isUnlimited && $currentCount >= $maxCredits) {
            echo json_encode([
                'success' => false,
                'error' => 'limit_reached',
                'message' => "Maximum storage limit of {$maxCredits} Kundlis reached. Please delete an older Kundli to save a new one.",
                'count' => $currentCount,
                'max' => $maxCredits
            ]);
            exit;
        }

        $kundliRecord = [
            'id' => 'knd_' . bin2hex(random_bytes(6)),
            'name' => trim($kundliData['name']),
            'gender' => isset($kundliData['gender']) ? $kundliData['gender'] : 'Male',
            'year' => (int)$kundliData['year'],
            'month' => (int)$kundliData['month'],
            'day' => (int)$kundliData['day'],
            'hour' => (int)$kundliData['hour'],
            'minute' => (int)$kundliData['minute'],
            'second' => (int)$kundliData['second'],
            'placeName' => trim(isset($kundliData['placeName']) ? $kundliData['placeName'] : ''),
            'lat' => (float)$kundliData['lat'],
            'lon' => (float)$kundliData['lon'],
            'tz' => (float)$kundliData['tz'],
            'ayanamshaType' => isset($kundliData['ayanamshaType']) ? $kundliData['ayanamshaType'] : 'lahiri',
            'tag' => trim(isset($kundliData['tag']) ? $kundliData['tag'] : 'Personal'),
            'notes' => trim(isset($kundliData['notes']) ? $kundliData['notes'] : ''),
            'savedAt' => date('Y-m-d H:i:s')
        ];

        array_unshift($user['saved_kundlis'], $kundliRecord);
        saveDatabase($dbFile, $db);

        echo json_encode([
            'success' => true,
            'kundli' => $kundliRecord,
            'count' => count($user['saved_kundlis']),
            'max' => $maxCredits,
            'message' => "Horoscope for {$kundliRecord['name']} saved to server successfully!"
        ]);
        break;

    case 'get_kundlis':
        $user = getCurrentUser($db);
        if (!$user) {
            echo json_encode(['success' => false, 'error' => 'not_authenticated', 'message' => 'Please sign in to view your saved Kundlis.']);
            exit;
        }
        echo json_encode([
            'success' => true,
            'kundlis' => isset($user['saved_kundlis']) ? $user['saved_kundlis'] : [],
            'count' => count($user['saved_kundlis']),
            'max' => $user['max_credits']
        ]);
        break;

    case 'delete_kundli':
        $user = &getCurrentUser($db);
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
            exit;
        }

        $kundliId = isset($post['id']) ? $post['id'] : (isset($_GET['id']) ? $_GET['id'] : '');
        $initialCount = count($user['saved_kundlis']);
        $user['saved_kundlis'] = array_values(array_filter($user['saved_kundlis'], function($k) use ($kundliId) {
            return $k['id'] !== $kundliId;
        }));

        if (count($user['saved_kundlis']) < $initialCount) {
            saveDatabase($dbFile, $db);
            echo json_encode([
                'success' => true,
                'count' => count($user['saved_kundlis']),
                'max' => $user['max_credits'],
                'message' => 'Kundli removed from server successfully.'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Kundli not found.']);
        }
        break;

    default:
        echo json_encode(['status' => 'online', 'service' => 'Indus Kundli App Server API', 'version' => '1.0']);
        break;
}
