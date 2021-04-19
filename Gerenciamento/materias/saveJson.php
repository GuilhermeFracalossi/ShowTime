<?php
$curso = $_POST['curso'];
$turma = $_POST['turma'];
$materias = $_POST['materias'];
$arquivo = file_get_contents('../../dados.json');
$dadosJson = json_decode($arquivo, JSON_UNESCAPED_UNICODE);
$professores = [];
foreach ($dadosJson['Professores'] as $cod => $professorValue) {
    $professores[$professorValue['nome']] = $cod;
}
$dadosJson['Cursos'][$curso][$turma]['materias'] = array();
foreach ($materias as $materiaValue) {
    $materia = [
        'nome' => strval($materiaValue['nome']),
        'codprof' => strval($professores[$materiaValue['professor']]),
        'ch' => strval($materiaValue['ch'])
    ];
    array_push($dadosJson['Cursos'][$curso][$turma]['materias'], $materia);
}
file_put_contents('../../dados.json', json_encode($dadosJson, JSON_UNESCAPED_UNICODE));
?>