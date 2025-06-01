<?php
// api/coletas/create.php
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


$data_coleta_str = $input['data_coleta'] ?? null;    
$hora_coleta_str = $input['hora_coleta'] ?? null;   
$tipo_residuo_agendado = $input['tipo_residuo_agendado'] ?? null; 

if (empty($data_coleta_str) || empty($hora_coleta_str) || empty($tipo_residuo_agendado)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Data, hora e tipo de resíduo para coleta são obrigatórios."]);
    exit();
}


$data_coleta_completa_str = $data_coleta_str . ' ' . $hora_coleta_str . ':00';
try {
    $data_coleta_dt = new DateTime($data_coleta_completa_str);
    $data_coleta_mysql = $data_coleta_dt->format('Y-m-d H:i:s');
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Formato de data ou hora inválido."]);
    exit();
}


$data_atual = new DateTime();
if ($data_coleta_dt < $data_atual) {
    
     if ($data_coleta_dt->format('Y-m-d') === $data_atual->format('Y-m-d') && $data_coleta_dt < $data_atual) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "A hora da coleta não pode ser no passado para o dia de hoje."]);
        exit();
     } else if ($data_coleta_dt->format('Y-m-d') < $data_atual->format('Y-m-d')) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "A data da coleta não pode ser no passado."]);
        exit();
     }
}

$id_residuo_fk = null; 

$sql = "INSERT INTO coletas (data_coleta, tipo_residuo_solicitado, descricao_coleta, id_usuario_agendamento, id_residuo, status) 
        VALUES (?, ?, ?, ?, ?, 'agendada')";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro no servidor ao preparar para agendar coleta: " . $conn->error]);
    exit();
}


$stmt->bind_param("sssii", 
    $data_coleta_mysql, 
    $tipo_residuo_agendado, 
    $observacoes, 
    $id_usuario_logado,
    $id_residuo_fk 
);

if ($stmt->execute()) {
    $id_inserido = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Coleta agendada com sucesso!",
        "data" => [
            "id_coleta" => $id_inserido,
            "data_coleta" => $data_coleta_mysql,
            "tipo_residuo_solicitado" => $tipo_residuo_agendado,
            "descricao_coleta" => $observacoes,
            "id_usuario_agendamento" => $id_usuario_logado,
            "status" => "agendada"
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro ao agendar coleta: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>