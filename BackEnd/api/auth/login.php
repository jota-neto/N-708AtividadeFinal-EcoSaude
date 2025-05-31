<?php
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/jwt_handler.php'; // Inclui nosso helper JWT

$input = json_decode(file_get_contents('php://input'), true);

$email = $input['email'] ?? null;
$senha_pura = $input['senha'] ?? null;

if (empty($email) || empty($senha_pura)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email e senha são obrigatórios."]);
    exit();
}

$stmt = $conn->prepare("SELECT id_usuario, nome, email, senha, role FROM usuarios WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro no servidor [login_prepare]: " . $conn->error]);
    exit();
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($senha_pura, $user['senha'])) {
       
        $token = generate_jwt_token($user['id_usuario'], $user['role'], $user['nome'], $user['email']);
        
        unset($user['senha']);

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Login bem-sucedido!",
            "data" => [
                "token" => $token,
                "user" => $user
            ]
        ]);
    } else {
        http_response_code(401); 
        echo json_encode(["status" => "error", "message" => "Credenciais inválidas."]);
    }
} else {
    http_response_code(401); 
    echo json_encode(["status" => "error", "message" => "Credenciais inválidas."]);
}

$stmt->close();
$conn->close();
?>