<?php

// $CSV = $_POST['data'];

$destino = 'CSVs/' . $_FILES['csv']['name'];
 
$arquivo_tmp = $_FILES['csv']['tmp_name'];
  
$arquivo = fopen($_FILES['csv']['tmp_name'], 'r');


$file = file_get_contents("../../dados.json");
$dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);
$códigosatribuidos = [];


function toNumber($n){
    return intval($n);
}

while(($linha = fgetcsv($arquivo,1000,',')) != FALSE){
    $bloqueios = explode( '-', $linha[2]);
    $código = $linha[1];
    if($código == "" || array_key_exists($código, $dados['Professores'])){
        $código = count($dados['Professores'])+1;
        $códigosatribuidos[] = [
            'nome' => $linha[0],
            'código' => $código
        ];
    }
    $professor = [
        'nome' => $linha[0],
        'bloqueios' => null
    ];
    $bloqueios = array_map('toNumber', $bloqueios);
    foreach ($bloqueios as $key => $value) {
        $professor['bloqueios'][] = $value;
    }
    $dados['Professores'][$código] = $professor;
}
fclose($arquivo);

file_put_contents('../../dados.json',json_encode($dados, JSON_UNESCAPED_UNICODE));

foreach($códigosatribuidos as $value){
    print 'O professor ' . $value['nome'] . ' recebeu o código ' . $value['código'] . '. </br> ';
} 








?>