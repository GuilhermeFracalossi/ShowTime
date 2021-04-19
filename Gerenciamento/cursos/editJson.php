<?php

$dados = $_POST['cursosEturmas']; //Cursos e turmas que vieram da página

//JSON
$arquivo = file_get_contents("../../dados.json");
$json = json_decode($arquivo, true, JSON_UNESCAPED_UNICODE);

$cursosEturmas = [];


foreach($dados as $cursos){
    
    foreach($cursos[key($cursos)] as $turma){
      
        $cursosEturmas[key($cursos)][] = $turma;
        
    }
}

//Remoção de cursos e turmas
foreach ($json['Cursos'] as $cursoJson => $turmaJson) {

    foreach ($json['Cursos'][$cursoJson] as $turmaKey => $turmaValue) {
        if (!(in_array($turmaKey, $cursosEturmas[$cursoJson]))) {
            unset($json['Cursos'][$cursoJson][$turmaKey]);
        }
    }

    if (!(key_exists($cursoJson, $cursosEturmas))) {
        unset($json['Cursos'][$cursoJson]);
    }

    //Adição de cursos e turmas

}
//Adiciona cursos e turmas

foreach ($cursosEturmas as $curso => $turmas) {
    
    foreach($turmas as $turma){
        if(!(array_key_exists($turma, $json['Cursos'][$curso]))){
           $json['Cursos'][$curso][$turma]= new stdClass();
        }
    }
    if (!(array_key_exists($curso, $json['Cursos']))) {
        $json['Cursos'][$curso] = new stdClass();
    }

    
    

}

file_put_contents('../../dados.json', json_encode($json, JSON_UNESCAPED_UNICODE));
