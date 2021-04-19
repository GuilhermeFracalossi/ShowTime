<?php 
$novonome = $_POST['nome'];
$codigo = $_POST['cod'];

$file = file_get_contents("../../dados.json");
$dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);


$dados['Professores'][$codigo]['nome'] = $novonome;


file_put_contents('../../dados.json',json_encode($dados, JSON_UNESCAPED_UNICODE));



var_dump($dados);
?>