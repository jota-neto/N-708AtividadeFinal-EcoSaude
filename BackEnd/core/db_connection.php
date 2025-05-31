<?php
// core/db_connection.php
header("Access-Control-Allow-Origin: *"); // Permite acesso de qualquer origem (frontend)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$usuario_db = 'root';    // Usuário padrão do MySQL no XAMPP
$senha_db = '';          // Senha padrão do root no XAMPP é vazia
$banco_db = 'formulario_eco';

$conn = new mysqli($host, $usuario_db, $senha_db, $banco_db);

if ($conn->connect_error) {
    http_response_code(503); // Service Unavailable
    echo json_encode(["status" => "error", "message" => "Erro de conexão com o banco de dados: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");
?>