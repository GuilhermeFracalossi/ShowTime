function updateJson() {
    $.getJSON('../../dados.json', function (data) {
        jsonDados = data
        loadMaterias(curso, turma)
    })
}

function showMenu() {
    $('.nav').slideToggle(200)
}

function dropdown() {
    $('.dropdown').click(function () {
        $(this).find('.arrow-down').toggleClass('upArrow')

        $(this).children('ul').css('visibility', 'visible')
        $(this).children('ul').fadeToggle(0)
    })
}

var professores = []

function fillDatalistProfessores() {

    for (let professorCod in jsonDados['Professores']) {

        var nomeProfessor = jsonDados['Professores'][professorCod]['nome']

        professores.push(nomeProfessor)
        var option = `<option value='${nomeProfessor}'></option>`

        $('datalist').append(option)
    }

}
var curso = null
var turma = null

function selectCursosTecnicos() {
    if(!jsonDados['Cursos']) alert('Nenhum curso cadastrado!')
    for (let curso in jsonDados['Cursos']) {

        $('#tecnicos').append("<option values='" + curso + "'>" + curso + "</option>")
    }

    $('#tecnicos').change(function () {
        $('.buttons div').hide()
        $('.materia').remove()
        curso = $(this).val()
        fillTurmaSelect(curso)


        $('#tecnicos').val(curso)
        $('#turmas').attr('disabled', false)
    })
}

function fillTurmaSelect(cursoTecnico) {

    $('#turmas').children().each(function () {
        var elemento = $(this)
        elemento.remove()
    })
    $('#turmas').append("<option value='-1' disabled selected>Selecione...</option>")
    for (var key in jsonDados['Cursos'][cursoTecnico]) {
        $('#turmas').append("<option values='" + key + "'>" + key + "</option>")
    }

}

function selectTurma() {

    $('#turmas').change(function () {

        turma = $(this).val()
        loadMaterias(curso, turma)
    })
}

function materiasColors() {
    var cores = ['#0e8584', '#be0f40', '#a30d8b',
        '#147599', '#10895c', '#221a9f', '#099b28', '#174260', '#5ca609', '#410fa3', '#b64b00', '#60175e', '#4f4a4a', '#0059b4', '#601717', '#601736',
        '#a1960f', '#b61414', '#391760', '#181760', '#850aae', '#17605c', '#176037', '#236017', '#4e6017', '#603f17', '#141414'
    ]
    var posicao = 0


    $('.materia').each(function () {

        if (cores[posicao]) {
            $(this).css('background-color', cores[posicao])
            posicao++
        } else {
            $(this).css('background-color', '#008892')
        }

    })
}

function loadMaterias(cursoTecnico, turma) {
    $('.buttons div').css('display', 'flex')
    $('.intro-text').hide()
    $('.materia').remove()

    if (jsonDados['Cursos'][cursoTecnico][turma].hasOwnProperty('materias') && jsonDados['Cursos'][cursoTecnico][turma]['materias'].length > 0) {
        $('.nothingToShow').hide()
        for (let materia in jsonDados['Cursos'][cursoTecnico][turma]['materias']) {
            let nomeMateria = jsonDados['Cursos'][cursoTecnico][turma]['materias'][materia]['nome']
            let cargaHoraria = jsonDados['Cursos'][cursoTecnico][turma]['materias'][materia]['ch']
            let professorCod = jsonDados['Cursos'][cursoTecnico][turma]['materias'][materia]['codprof']

            let professorName = jsonDados['Professores'][professorCod]['nome']

            let materiaBox = `
            <div class="materia">
            <img src="images/remove-white.png" class="remove-materia-icon" onclick="removeMateria($(this).parent())" title="Remover matéria">
            <h3 class="materia-name">${nomeMateria}</h3>
            <img src="images/edit-icon.png" onclick="editMateria($(this).parent())" class="edit-materia-icon" title="Editar nome">
            <div class="professor-container">
                <div>Professor:</div>
                <input list="professores-list" value='${professorName}'>
                
            </div>
            <div class="carga-horaria">Carga horária: <input type="number" value="${cargaHoraria}"></div>
        </div>`

            $('.materias-container').append(materiaBox)

        }
        $('.materia').each(function () {
            $(this).fadeIn('slow')
            $(this).css('display', 'flex')
        })
    } else {

        $('.nothingToShow').show()
    }

    materiasColors()
}

function novaMateria() {
    $('.nothingToShow').hide()

    let materiaBox = `
    <div class="materia">
    <img src="images/remove-white.png" class="remove-materia-icon" onclick="removeMateria($(this).parent())" title="Remover matéria">
    <h3 class="materia-name" contenteditable='true'></h3>
    <img src="images/edit-icon.png" onclick="editMateria($(this).parent())" class="edit-materia-icon" title="Editar nome">
    <div class="professor-container">
        <div>Professor:</div>
        <input list="professores-list">
        
    </div>
    <div class="carga-horaria">Carga horária: <input type="number" value="0"></div>
</div>`

    $('.materias-container').append(materiaBox)
    $('.materia').last().fadeIn('slow').css('display', 'flex')
    $('.materia').last().children('.materia-name').focus()
    materiasColors()
}

function removerTodos() {
    $('.black-background, .warning').show()

    $('.botao-cancelar').click(function () {
        $('.black-background, .warning').hide()
    })
    $('.botao-confirmar').click(function () {

        $('.materia').remove()

        $('.nothingToShow').show()
        $('.black-background, .warning').hide()
    })
}

function removeMateria(materia) {
    $(materia).remove()

    if ($('.materia').length == 0) {

        $('.nothingToShow').show()
    }
}

function editMateria(materia) {
    $(materia).children('.materia-name').attr('contenteditable', true).focus()
}

function confirmOnEnter() {
    $(document).keydown(function (event) {
        
        if (event.keyCode == 13) {
            $('.materia-name').each(function(){
                if($(this).html() == ''){
                    $(this).parent(".materia").remove()  
                }else{
                    $('.materia-name').attr('contenteditable', false)
                }
            })
            
        }
    })
}



function salvar() {
    let materias = []
    $('.materia').each(function () {
        let nomeMateria = $(this).children('.materia-name').html()
        let professorName = $(this).children('.professor-container').children('input').val()
        let cargaHoraria = $(this).children('.carga-horaria').children('input').val()

        materias.push({
            nome: nomeMateria,
            professor: professorName,
            ch: cargaHoraria
        })
    })



    let curso = $('#tecnicos').val()
    let turma = $('#turmas').val()

    $.ajax({
        url: 'saveJson.php',
        method: 'POST',
        cache: false,
        data: {
            curso,
            turma,
            materias
        },
        success: function (result, status) {
            $('.salvar').find('h2').html('Salvo')
            $('.salvar').find('img').attr('src', 'images/saved.png')

            setTimeout(function () {
                $('.salvar').find('h2').html('Salvar')
                $('.salvar').find('img').attr('src', 'images/save.png')
            }, 800)
        },
        error: function () {
            alert('Não foi possível salvar suas alterações [error 404]')
        }
    }).done(function (response) {
        updateJson()

    })
}
$(function () {
    $.ajaxSetup({
        cache: false
    });
    selectTurma()
    dropdown()
    confirmOnEnter()
    materiasColors()
})