<?php 
    if(file_get_contents("../../horarios.json")){
        $file = file_get_contents("../../horarios.json");
        $dados = json_decode($file, true, JSON_UNESCAPED_UNICODE);
    }

    $file = file_get_contents("../../dados.json");
    $dadosProfessor = json_decode($file, true, JSON_UNESCAPED_UNICODE);

    $vetor = [];
    $turma =$_POST['turma']; 
    $schedules = $_POST['schedules'];

   
    $todosProfessores = [];
    
    foreach($schedules as $periodo){
        if($periodo['professor'] == 'VAZIO') continue;

        if(!array_key_exists($periodo['professor'], $todosProfessores))
            $todosProfessores[$periodo['professor']] = [];

       
        $todosProfessores[$periodo['professor']][] = $periodo['periodo']+0;

        if(array_key_exists($periodo['nomeDaMateria'], $vetor)){
            $vetor[$periodo['nomeDaMateria']]['periodos'][] = $periodo['periodo']+0;

        }else{
            $vetor[$periodo['nomeDaMateria']] = [
                'nomeDaMateria' => $periodo['nomeDaMateria'],
                'professor' => $periodo['professor'],
                'periodos' => [$periodo['periodo']+0]
            ];
        }
        
        
    }
   
    $dados[$turma]=$vetor;
    
    file_put_contents('../../horarios.json',json_encode($dados, JSON_UNESCAPED_UNICODE));


    $todosAtuais = [];
    foreach($dados as $turma => $horarios){
        foreach($horarios as $nomeDaMateria => $materia){
            
            $todosAtuais[$materia['professor']]= $materia['periodos'];
            
        }
    }
    
    
//MATERIAS DIFERENTES COM PROFESSORES IGUAIS
    $menos = [];
    foreach($todosProfessores as $professor => $bloqueios){
        
        $menos = array_diff($todosAtuais[$professor], $bloqueios);
        $final[$professor] = array_unique(array_merge($dadosProfessor['Professores'][$professor]['bloqueios'], $bloqueios));
        
        $dadosProfessor['Professores'][$professor]['bloqueios'] = array_values(array_diff($final[$professor], $menos));
    }
    
    //print json_encode($dadosProfessor['Professor']);
    //die();
    
    file_put_contents('../../dados.json',json_encode($dadosProfessor, JSON_UNESCAPED_UNICODE));
    //print json_encode($dados);
die();




?>