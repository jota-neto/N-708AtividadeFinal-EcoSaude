<?php
$host = 'localhost';
$usuario = 'root';
$senha = '';   
$banco = 'formulario_eco';


$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}


$tipo = $_POST['tipo'];
$peso = $_POST['peso'];
$unidade = $_POST['unidade'];
$descricao = $_POST['descricao'];

$sql = "INSERT INTO residuos (tipo, peso, unidade, descricao) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $tipo, $peso, $unidade, $descricao);

if ($stmt->execute()) {
    echo "<h2>Resíduo cadastrado com sucesso!</h2>";
    echo "<a href='cadastro-residuo.html'>Voltar</a>";
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conn->close();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>


//NÃO FINALIZADO