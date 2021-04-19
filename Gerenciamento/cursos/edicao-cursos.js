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


function loadCursos() {
    $('.curso-container').remove()
    $.getJSON('../../dados.json', function (data) {

        if (jQuery.isEmptyObject(data.Cursos)) {
            $('.nothingToShow').show()
        }
        for (let curso in data.Cursos) {
            var cursoBox = `<div class='curso-container'>
                <div class='curso-head'><img onclick='removeCurso($(this).parent().parent())' class='remove-icon' src='images/remove-white.png'><h1>${curso}</h1></div>`

            for (let turma in data.Cursos[curso]) {

                cursoBox += `
            <div class="turma-item">
                <div class="color"></div>
               <h2>${turma}</h2><img onclick='removeTurma($(this).parent())' class='remove-turma-icon' src="images/remove-icon.png" alt="">
                
            </div>`

            }

            cursoBox += `
            <div class="turma-item empty-turma">
                
                <h2>Nova turma</h2>
                
            </div>`
            cursoBox += `</div>`
            $('.main-container').append(cursoBox)

        }
        sortCursosColors()
        novaTurma()

    })

}


function sortCursosColors() {
    var cores = ['#221a9f', '#0e8584', '#be0f40', '#b64b00', '#10895c', '#a30d8b',
        '#099b28', '#147599', '#410fa3', '#174260', '#5ca609', '#4f4a4a', '#0059b4', '#601717', '#601736',
        '#a1960f', '#b61414', '#60175e', '#391760', '#181760', '#850aae', '#17605c', '#176037', '#236017', '#4e6017', '#603f17', '#141414'
    ]
    var posicao = 0


    $('.curso-container').each(function () {

        if (cores[posicao]) {
            $(this).find('.curso-head').css('background-color', cores[posicao])

            $(this).find('.color').css('background-color', cores[posicao])
            posicao++
        } else {
            $(this).find('.curso-head').css('background-color', '#008892')
        }

    })
}

function novoCurso() {
    $('.nothingToShow').hide()
    var curso = `
    <div class="curso-container">
            <div class="curso-head">
            <img onclick='removeCurso($(this).parent().parent())' class='remove-icon' src='images/remove-white.png'><h1 contenteditable="true"></h1>
            </div>
            <div class="turma-item empty-turma">
            <h2>Nova turma</h2> 
            </div>
     </div>`
   
    $('.main-container').append($(curso))
    sortCursosColors()
    $('.curso-head h1').last().focus()
    novaTurma()
}

function removeCurso(curso) {

    let nomeCurso = $(curso).find('h1').html()
    $('.warning').children('img').attr('src', 'images/trash2.svg')
    $('.warning').find('h1').html(`Tem certeza que deseja remover o curso: ${nomeCurso}?`)
    $('.black-background,  .warning').show()

    $('.botao-cancelar').click(function () {
        curso = null
        $('.black-background, .warning').hide()
    })
    $('.botao-confirmar').click(function () {

        $(curso).remove()

        if ($('.curso-container').length == 0) {

            $('.nothingToShow').show()
        }
        $('.black-background, .warning').hide()
    })

}


function novaTurma() {

    $('.turma-item').click(function () {
        
        if ($(this).hasClass('empty-turma')) {
            console.log('empty')
            $(this).removeClass('empty-turma')
            $(this).prepend(`<div class='color'></div>`)
            $(this).append(`<img onclick='removeTurma($(this).parent())' class='remove-turma-icon' src="images/remove-icon.png" alt="">`)

            sortCursosColors()
            $(this).find('h2').html('').attr('contenteditable', true).focus()
        }
    })
}

function removeTurma(turma) {
    let nomeTurma = $(turma).children('h2').html()
    if (nomeTurma != '') {
        $('.warning').children('img').attr('src', 'images/trash2.svg')
        $('.warning').find('h1').html(`Tem certeza que deseja remover a turma: ${nomeTurma}?`)
        $('.black-background,  .warning').show()

        $('.botao-cancelar').click(function () {
            turma = null
            $('.black-background, .warning').hide()
        })
        $('.botao-confirmar').click(function () {
            addEmptyTurma($(turma).parent())
            $(turma).remove()
            $('.black-background, .warning').hide()
        })
    } else {
        addEmptyTurma($(turma).parent())
        $(turma).remove()
        $('.black-background, .warning').hide()
    }
}


function addEmptyTurma(curso) {
    console.log($(curso).children('.empty-turma').length)
    if ($(curso).children('.empty-turma').length == 0) {
        $(curso).append(`
        <div class="turma-item empty-turma">     
            <h2>Nova turma</h2> 
        </div>`)
        novaTurma()
    }
}

function removerTodos() {

    $('.warning').children('img').attr('src', 'images/delete.png')
    $('.warning').find('h1').html(`Tem certeza que deseja remover TODOS os cursos?`)
    $('.black-background,  .warning').show()

    $('.botao-cancelar').click(function () {

        $('.black-background, .warning').hide()
    })
    $('.botao-confirmar').click(function () {

        $('.curso-container').remove()
        $('.nothingToShow').show()
        $('.black-background, .warning').hide()
    })



}


function confirmEditingOnEnter() {
    $(document).keydown(function (event) {

        if (event.keyCode == 13) {
            $('.curso-container h1').each(function(){
                if ($(this).html() == "") {

                    $(this).parent().parent().remove()
                }
            })
            $('.turma-item h2').each(function () {
                if ($(this).html() == "") {
                    $(this).parent().addClass('empty-turma')

                    $(this).parent().find('.color, img').remove()
                    $(this).html('Nova turma')
                }else{
                    addEmptyTurma($(this).parent().parent())
                }
            })
            $('.curso-container h1, .turma-item h2').blur().attr('contenteditable', false)
           
        }

    })

}

function salvar() {
    var cursosEturmas = []
    var c = 0
    var nomeCurso
    if ($('.curso-container').length == 0) {

        nomeCurso = null
        cursosEturmas.push({
            [nomeCurso]: []
        })
    }
    $('.curso-container').each(function () {

        nomeCurso = $(this).children('.curso-head').children('h1').html()
        if (nomeCurso != '') {
            cursosEturmas.push({
                [nomeCurso]: []
            })
        }

        $(this).children('.turma-item').each(function () {
            var nomeTurma = $(this).find('h2').html().toUpperCase() || null
            
            if(nomeTurma != null && nomeTurma != 'NOVA TURMA'){
                 cursosEturmas[c][nomeCurso].push(nomeTurma)
            }
           
        })
        c++
    })

    $.ajax({
        url: 'editJson.php',
        method: 'POST',
        data: {
            cursosEturmas
        },
        cache: false,
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

        loadCursos()
    })
}
$(function () {
    $.ajaxSetup({
        cache: false
    })
    dropdown()
    loadCursos()

    confirmEditingOnEnter()

})