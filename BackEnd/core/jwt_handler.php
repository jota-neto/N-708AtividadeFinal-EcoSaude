<?php
// core/jwt_handler.php
require_once __DIR__ . '/../vendor/autoload.php'; // Para carregar a biblioteca JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Carregar variáveis de ambiente (simples, sem .env aqui para agilidade, mas idealmente usaria)
// Para o prazo, vamos definir diretamente. EM UM PROJETO REAL, USE .ENV!
define('JWT_SECRET_KEY', 'SEGREDO_SUPER_SECRETO_DO_JWT'); // MUDE ISSO!
define('JWT_EXPIRE_TIME', time() + (60 * 60)); // Expira em 1 hora (60 seg * 60 min)

function generate_jwt_token($userId, $userRole, $userNome = null, $userEmail = null) {
    $payload = [
        'iss' => "http://localhost", 
        'aud' => "http://localhost", 
        'iat' => time(),             
        'nbf' => time(),             
        'exp' => JWT_EXPIRE_TIME,    
        'data' => [                  
            'userId' => $userId,
            'role' => $userRole,
            'nome' => $userNome,     
            'email' => $userEmail    
        ]
    ];

    return JWT::encode($payload, JWT_SECRET_KEY, 'HS256');
}


function validate_jwt_token($token) {
    if (!$token) {
        return null;
    }

    if (preg_match('/Bearer\s(\S+)/', $token, $matches)) {
        $token = $matches[1];
    }

    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));
        return (array) $decoded->data; 
    } catch (Exception $e) {
        return null; 
    }
}
?>