<?php 

$file = file_get_contents("../../dados.json");
$dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);


$bloqueios = $_POST['bloqueios'];
$professor = $_POST['cod'];

$bloqueios = array_map('toNumber', $bloqueios);

function toNumber($n){
    return intval($n);
}


$dados['Professores'][$professor]['bloqueios'] = $bloqueios;

file_put_contents('../../dados.json',json_encode($dados, JSON_UNESCAPED_UNICODE));

?>