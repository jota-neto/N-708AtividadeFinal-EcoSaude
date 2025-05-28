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
$unidade = $_POST['unidade-medida'];
$descricao = $_POST['descricao'];

$sql = "INSERT INTO residuos (`tipo-residuo`, peso, `unidade-medida`, descricao) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Erro na conexão: " . $conn->error);
}

$stmt->bind_param("ssss", $tipo, $peso, $unidade, $descricao);

if ($stmt->execute()) {
    echo "<h2>Resíduo cadastrado com sucesso!</h2>";
    echo "<a href='cadastro-residuo.html'>Voltar</a>";
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>


//NÃO FINALIZADO