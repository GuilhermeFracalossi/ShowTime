<?php
    $file = file_get_contents("../../dados.json");
    $dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);
    $novoArray = $_POST['informacoes'];
    $informacoes = [];
    foreach ($novoArray as $key => $value) {
        $informacoes[] = explode("_", $value);
    }
    foreach ($informacoes as $key => $value) {
        $periodo = $value[0] + 0;
        $professor = $value[1] . "";
        if ($periodo === "VAZIO") {
            continue;
        }
        $dados['Professores'][$professor]['bloqueios'][] = $periodo;
    }
    $json_final = file_put_contents('../../dados.json',json_encode($dados));

?>