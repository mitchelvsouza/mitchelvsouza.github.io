<?php include 'conexao/conexao.php' ;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
$data = $_POST['data'];
$fornecedor = $_POST['fornecedor'];
$credito = $_POST['credito'];

$sql = "INSERT INTO tabela (data, credito, fornecedor) VALUES ('$data', '$credito', '$fornecedor')";
$conn->query($sql);}  ?>



<html>
<form method="post" action="">

<input type="date" name="data">
<input type="text" name="fornecedor">
<input type="number" name="credito" step="0.01"/>                                       

<input type="submit" value="Salvar">
</form>
</html>
