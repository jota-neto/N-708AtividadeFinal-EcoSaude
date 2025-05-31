<?php
// api/residuos/create.php
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/jwt_handler.php';

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
$token_data = null;

if ($authHeader) {
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token_string_only = $matches[1];
        $token_data = validate_jwt_token($token_string_only);
    }
}

if (!$token_data || !isset($token_data['userId'])) {
    http_response_code(401); 
    echo json_encode(["status" => "error", "message" => "Acesso não autorizado."]);
    exit();
}

$id_usuario_logado = $token_data['userId'];

$input = json_decode(file_get_contents('php://input'), true);

$tipo_residuo = $input['tipo_residuo'] ?? null;
$peso = $input['peso'] ?? null;
$unidade_medida = $input['unidade_medida'] ?? null;
$descricao = $input['descricao'] ?? ''; 

if (empty($tipo_residuo) || !isset($peso) || empty($unidade_medida)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Campos tipo_residuo, peso e unidade_medida são obrigatórios."]);
    exit();
}
if (!is_numeric($peso) || $peso <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Peso deve ser um número positivo."]);
    exit();
}

$sql = "INSERT INTO residuos (tipo_residuo, peso, unidade_medida, descricao, id_usuario_registro, data_registro) VALUES (?, ?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro no servidor ao preparar para cadastrar resíduo."]);
    exit();
}

$stmt->bind_param("ssdss", $tipo_residuo, $peso, $unidade_medida, $descricao, $id_usuario_logado);

if ($stmt->execute()) {
    $id_inserido = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Resíduo cadastrado com sucesso!",
        "data" => [
            "id_residuo" => $id_inserido,
            "tipo_residuo" => $tipo_residuo,
            "peso" => $peso,
            "unidade_medida" => $unidade_medida,
            "descricao" => $descricao,
            "id_usuario_registro" => $id_usuario_logado
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro ao cadastrar resíduo."]);
}

$stmt->close();
$conn->close();
?>