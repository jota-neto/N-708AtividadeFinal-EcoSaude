<?php

require_once __DIR__ . '/../../core/db_connection.php';

$input = json_decode(file_get_contents('php://input'), true);

$nome = $input['nome'] ?? null;
$email = $input['email'] ?? null;
$senha_pura = $input['senha'] ?? null;
$role = $input['role'] ?? 'operador'; 

if (empty($nome) || empty($email) || empty($senha_pura)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Nome, email e senha são obrigatórios."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Formato de email inválido."]);
    exit();
}

if (strlen($senha_pura) < 6) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "A senha deve ter pelo menos 6 caracteres."]);
    exit();
}

$stmt_check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
if (!$stmt_check) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro no servidor [check_email_prepare]: " . $conn->error]);
    exit();
}
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    http_response_code(409); 
    echo json_encode(["status" => "error", "message" => "Email já cadastrado."]);
    $stmt_check->close();
    $conn->close();
    exit();
}
$stmt_check->close();

$senha_criptografada = password_hash($senha_pura, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro no servidor [insert_user_prepare]: " . $conn->error]);
    $conn->close();
    exit();
}
$stmt->bind_param("ssss", $nome, $email, $senha_criptografada, $role);

if ($stmt->execute()) {
    $id_inserido = $stmt->insert_id;
    http_response_code(201); 
    echo json_encode([
        "status" => "success",
        "message" => "Usuário registrado com sucesso!",
        "data" => [
            "id_usuario" => $id_inserido,
            "nome" => $nome,
            "email" => $email,
            "role" => $role
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro ao cadastrar usuário: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>