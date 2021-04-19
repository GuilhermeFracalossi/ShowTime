<?php 

$periodo = $_POST['periodo'];
$professor = $_POST['professor'];

$file = file_get_contents("../../dados.json");
$dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);

$dados['Professores'][$professor]['bloqueios'] = array_diff( $dados['Professores'][$professor]['bloqueios'], [$periodo] );

var_dump($dados['Professores'][$professor]['bloqueios']);
 file_put_contents('../../dados.json',json_encode($dados, JSON_UNESCAPED_UNICODE));

 ?>