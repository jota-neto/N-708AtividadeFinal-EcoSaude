<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "formulario_eco";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$data = $_POST['data'] ?? '';
$hora = $_POST['hora'] ?? '';
$descricao = $_POST['descricao'] ?? '';

if (!$data || !$hora || !$descricao) {
    die("Preencha todos os campos obrigatórios.");
}

$sql = "INSERT INTO agendamentos (data, hora, descricao) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Erro no prepare: " . $conn->error);
}

$stmt->bind_param("sss", $data, $hora, $descricao);

if ($stmt->execute()) {
    echo "<h2>Coleta agendada com sucesso!</h2>";
    echo "<a href='agendamento-coleta.html'>Voltar</a>";
} else {
    echo "Erro ao agendar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
