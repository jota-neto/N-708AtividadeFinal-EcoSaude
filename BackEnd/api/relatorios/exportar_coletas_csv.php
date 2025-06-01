<?php
// api/relatorios/exportar_coletas_csv.php
require_once __DIR__ . '/../../core/db_connection.php'; // Apenas para a variável $conn, não enviaremos JSON
require_once __DIR__ . '/../../core/jwt_handler.php';   // Para validar o token

// Validar Token JWT (copiado do gerar_coletas.php)
$authHeader = $_GET['token'] ?? null; // Vamos passar o token via GET para simplificar o download
$token_data = null;
if ($authHeader) { // No frontend, vamos pegar o token do localStorage e adicionar à URL
    $token_data = validate_jwt_token($authHeader); // A função validate_jwt_token já lida com "Bearer "
}

if (!$token_data || !isset($token_data['userId'])) {
    http_response_code(401);
    die("Acesso não autorizado."); // Mensagem simples, pois não é uma resposta JSON para fetch
}

// Pegar filtros da URL
$data_inicio = $_GET['data_inicio'] ?? null;
$data_fim = $_GET['data_fim'] ?? null;
$tipo_residuo_filtro = $_GET['tipo_residuo'] ?? null;

if (empty($data_inicio) || empty($data_fim)) {
    http_response_code(400);
    die("Datas de início e fim são obrigatórias.");
}

$data_inicio_dt = new DateTime($data_inicio);
$data_inicio_sql = $data_inicio_dt->format('Y-m-d 00:00:00');
$data_fim_dt = new DateTime($data_fim);
$data_fim_sql = $data_fim_dt->format('Y-m-d 23:59:59');

if ($data_fim_dt < $data_inicio_dt) {
    http_response_code(400);
    die("A data de fim não pode ser anterior à data de início.");
}

// SQL (mesmo do gerar_coletas.php)
$sql = "SELECT c.id_coleta, c.data_coleta, c.tipo_residuo_solicitado, c.descricao_coleta, c.status, u.nome as nome_usuario_agendamento 
        FROM coletas c
        LEFT JOIN usuarios u ON c.id_usuario_agendamento = u.id_usuario
        WHERE c.data_coleta BETWEEN ? AND ?";
$params = [$data_inicio_sql, $data_fim_sql];
$types = "ss";

if (!empty($tipo_residuo_filtro)) {
    $sql .= " AND c.tipo_residuo_solicitado = ?";
    $params[] = $tipo_residuo_filtro;
    $types .= "s";
}
$sql .= " ORDER BY c.data_coleta DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) { die("Erro ao preparar consulta: " . $conn->error); }

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

// --- Geração do CSV ---
$filename = "relatorio_coletas_" . date('Ymd') . ".csv";
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w'); // Abre o fluxo de saída para escrita

// Cabeçalho do CSV
fputcsv($output, ['ID Coleta', 'Data Coleta', 'Tipo Resíduo Solicitado', 'Descrição', 'Status', 'Agendado Por'], ';');

// Dados do CSV
while ($row = $result->fetch_assoc()) {
    $data_coleta_obj = new DateTime($row['data_coleta']);
    $row_csv = [
        $row['id_coleta'],
        $data_coleta_obj->format('d/m/Y H:i'),
        $row['tipo_residuo_solicitado'],
        $row['descricao_coleta'],
        $row['status'],
        $row['nome_usuario_agendamento'] ?? 'N/A'
    ];
    fputcsv($output, $row_csv, ';');
}

fclose($output);
$stmt->close();
$conn->close();
exit();
?>