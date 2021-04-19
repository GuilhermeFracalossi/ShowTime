<?php 

$file = file_get_contents("../../dados.json");
$dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);

$nome = $_POST['nomedoprofessor'];
$codigo = $_POST['cod'];
$bloqueios = $_POST['blocks'];

$bloqueios = array_map('toNumber', $bloqueios);

function toNumber($n){
    return intval($n);
}
if($codigo == ""){
    $dados['Professores'][] = [
        'nome' => $nome,
        'bloqueios' => $bloqueios
    ];
}else{
    $dados['Professores'][$codigo] = [
        'nome' => $nome,
        'bloqueios' => $bloqueios
    ];
}


file_put_contents('../../dados.json',json_encode($dados, JSON_UNESCAPED_UNICODE));

?>