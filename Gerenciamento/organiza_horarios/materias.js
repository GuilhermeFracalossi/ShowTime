$.ajaxSetup({
    cache: false
})

function updateJson() {
    removeDraggingEvents()
    var turma = $('.tools-container .cursos').val()

    var schedules = [];
    $('.class-period').each(function () {
        var elemento = $(this)
        var periodo = elemento.attr("data-period")
        var professor = ""
        var nomeDaMateria = ""

        if (elemento.children().attr("datacodprof")) {
            professor = elemento.children().attr("datacodprof")
        } else {
            professor = "VAZIO"
        }
        if (elemento.children().children().last().children().first().html()) {
            nomeDaMateria = elemento.children().children().last().children().first().html()
        } else {
            nomeDaMateria = "VAZIO"
        }
        schedules.push({
            periodo,
            professor,
            nomeDaMateria
        })

    })


    YearSchedule(schedules, turma)


}


function YearSchedule(schedules, turma) {

    $.ajax({
        url: 'saveHours.php',
        type: 'POST',
        data: {
            schedules,
            turma
        },
        cache: false,
        success: function (result, status, xhr) {
            //Se quiser e tiver tempo, faz um alert bonitinho kkkkk

            // alert('Turma salva com sucesso!')
            //addDraggingEvents()
        },
        error: function (xhr, status, error) {

        }
    }).done(function (response) {

        $.getJSON('../../dados.json', function (data) {
            json = data
            console.log('done1')

        }).done(function () {
            $.getJSON('../../horarios.json', function (data) {
                jsonhorarios = data
                console.log('done2')

            }).done(function () {
               addDraggingEvents()
            })
        })



    })

}

function sortBackgroundColor() { //sorteia uma cor de fundo para cada materia
    var cores = ['#ff8585', '#c7c7c7', '#ffb77d', '#ffe57d', '#7dff86', '#7dfff0', '#7dd4ff', '#8f87ff', '#d587ff', '#ff87ff', '#e2ff63',
        /*coresescura*/
        '#b63d3d', '#b6613d', '#b6b43d', '#3db649', '#3db6a2', '#3d80b6', '#513db6', '#a63db6', '#b63d67', '#5e5e5e',
    ]


    var materias = []
    var posicaoCor = 0
    $('.materia-each-container').each(function () {

        //var posicaoCor = Math.floor(Math.random() * cores.length)
        var nomeMateria = $(this).find('.materia-name').html()
        if (materias.filter(function (materia) {
                return materia.nome == nomeMateria
            }).length == 0) {

            materias.push({
                nome: nomeMateria,
                cor: cores[posicaoCor]
            })
            if (cores.length == 0) {
                cor = '#4fd6f7'
            } else {
                cor = cores[posicaoCor]
                // cores.splice(posicaoCor, 1)
            }
            posicaoCor++

            $(this).find('.materia-color').css('background-color', cor)
            $(this).find('.periodos').css('background-color', cor)

            $(this).find('.periodos').css('color', invertColor(cor, true))
            $(this).attr('data-font-color', invertColor(cor, true))

        } else {
            materias.filter(function (materia) {
                if (materia.nome == nomeMateria) {
                    cor = materia.cor
                }
            })

            $(this).find('.materia-color').css('background-color', cor)
            $(this).find('.periodos').css('background-color', cor)

            $(this).find('.periodos').css('color', invertColor(cor, true))
            $(this).attr('data-font-color', invertColor(cor, true))

        }
    })
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 160 ?
            '#000000' :
            '#FFFFFF';
    }
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

// -------------------------DRAGGABLE----------------------

var materiaDragging
var elementoBeforeMateria
const materiasContainer = $('.materias-list')

function addDraggingEvents() {
    materiaDragging = null
    elementoBeforeMateria = null
    $('.materia-each-container').attr('ondragend', 'dragEnd(event, this)')
    $('.materia-each-container').attr('ondragstart', 'dragStart(event, this)')
    $('.materia-each-container').attr('ondrag', 'dragging(event, this)')


    $('.table-cel').attr('ondragenter', 'dragEnter(this, event)')
    $('.table-cel').attr('ondragleave', 'dragLeave(this, event)')
    $('.table-cel').attr('ondragover', 'dragOver(this, event)')
    $('.table-cel').attr('ondrop', 'dropped(this, event)')

    $('.table-cel').attr('ondragend', 'dragEndTableCel(this, event)')

    // $('.materias-list').attr('ondrop', 'droppedOnList(this, event)')
    // $('.materias-list').attr('ondragover', 'dragOver(this, event)')

    $('.materias-drop-area').attr('ondrop', 'droppedOnList(this, event)')
    $('.materias-drop-area').attr('ondragover', 'dragOver(this, event)')
}

function removeDraggingEvents(){
    $('.materia-each-container').removeAttr('ondragend', 'dragEnd(event, this)')
    $('.materia-each-container').removeAttr('ondragstart', 'dragStart(event, this)')
    $('.materia-each-container').removeAttr('ondrag', 'dragging(event, this)')


    $('.table-cel').removeAttr('ondragenter', 'dragEnter(this, event)')
    $('.table-cel').removeAttr('ondragleave', 'dragLeave(this, event)')
    $('.table-cel').removeAttr('ondragover', 'dragOver(this, event)')
    $('.table-cel').removeAttr('ondrop', 'dropped(this, event)')

    $('.table-cel').removeAttr('ondragend', 'dragEndTableCel(this, event)')

    // $('.materias-list').attr('ondrop', 'droppedOnList(this, event)')
    // $('.materias-list').attr('ondragover', 'dragOver(this, event)')

    $('.materias-drop-area').removeAttr('ondrop', 'droppedOnList(this, event)')
    $('.materias-drop-area').removeAttr('ondragover', 'dragOver(this, event)')
}
var periodoCelulaAnterior
var professorCelulaAnterior

function dragStart(e, elemento) {
    periodoCelulaAnterior = $(elemento).parent().attr('data-period')
    professorCelulaAnterior = $(elemento).attr('datacodprof')

    elementoBeforeMateria = $(elemento).prev()
    showBlocks(elemento)
    materiaDragging = elemento

    let periodos = $(materiaDragging).find('.periodos').html()

    if (elemento.parentNode == document.getElementsByClassName('materias-list')[0]) {
        $(elemento).find('.periodos').html(periodos - 1)
    }

    if ($(elemento).parent().hasClass('table-cel')) {
        $('.materias-drop-area').show()
    }
}

function dragEnter(element, event) {
    if (checkValidDrop(element)) {
        $(element).addClass('dragEnter')
    }
}

function dragLeave(element) {
    $(element).removeClass('dragEnter')
}

function dragEnd(e, elemento) {
    hideBlocks()
    let periodos = $(elemento).find('.periodos').html()

    if (elemento.parentNode != document.querySelector('.table-cel')) {
        $(elemento).find('.periodos').html(parseInt(periodos) + 1)
    }


}

function dragEndTableCel(e, elemento) {

    $('.materias-drop-area').hide()

}

function dragging(e, elemento) {
    $(elemento).css('background-color', 'white')

}

function checkValidDrop(drop) {
    if (!(drop.hasChildNodes())) {
        if (!($(drop).hasClass('blocked'))) {
            return true
        }
    }
    return false
}



function dragOver(elemento, evento) {

    // if ($(event.target).parents('.materias-list').length == 1 ||
    //     event.target == document.querySelector('.materias-list')
    // ) {
    //     event.preventDefault()
    // }

    if ($(event.target).hasClass('materias-drop-area')) {
        event.preventDefault()
    }
    if ($(event.target).parents().hasClass('table-cel')) {
        event.preventDefault()
    }
    //console.log(event.target.parentNode == document.querySelector('.table-cel'))
    if (($(event.target).hasClass('table-cel'))) {
        if (!($(event.target).hasClass('blocked'))) {
            event.preventDefault()
        }
    }
}

 function dropped(elemento) {

    if (periodoCelulaAnterior) {
         removeBlock(periodoCelulaAnterior, professorCelulaAnterior)
    }

    hideBlocks()
    $(elemento).removeClass('dragEnter')
    let periodos = $(materiaDragging).find('.periodos').html()
    if (periodos > 0 && materiaDragging.parentNode == document.getElementsByClassName('materias-list')[0]) {

        $(materiaDragging).clone().insertAfter(elementoBeforeMateria)
    }
    $(materiaDragging).find('.periodos').remove()
    styleDropped(materiaDragging)

    if (($(materiaDragging).parent().hasClass('table-cel'))) {

        professor = $(elemento).children().attr('datacodprof')
        periodo = $(elemento).attr('data-period')
        console.log(professor, periodo)
        removeBlock(periodo, professor) //ARRUMAR
        $(materiaDragging).parent().append($(elemento).children())
        //$(elemento).append(materiaDragging)
    } else {
        if (elemento.hasChildNodes() && $(elemento).attr('data-period') != $(materiaDragging).parent().attr('data-period')) {

            colocaMateriaDeVolta($(elemento).children())
            $(elemento).children().remove()
        }
    }

    $(elemento).append(materiaDragging)

    updateJson()
    $('.materias-drop-area').hide()
}

function droppedOnList(elemento, event) {
    if (periodoCelulaAnterior) {
        removeBlock(periodoCelulaAnterior, professorCelulaAnterior)
    }
    hideBlocks()
    $(materiaDragging).addClass('materia-arrived')
    $(materiaDragging).removeClass('materia-inside')

    var materiasIguais = 0
    $('.materias-list .materia-each-container').each(function () {
        let nomeMateriaQueChegou = $(materiaDragging).find('.materia-name').html()
        let professorQueChegou = $(materiaDragging).find('.professor-name').html()

        let professorSendoTestado = $(this).find('.professor-name').html()
        let nomeMateriaSendoTestada = $(this).find('.materia-name').html()

        if (nomeMateriaQueChegou == nomeMateriaSendoTestada) {
            if (professorQueChegou == professorSendoTestado) { //Necessario pois há a possibilidade de haver 2 materias com o mesmo nome (3 ENO)
                if (materiaDragging.parentNode != document.querySelector('.materias-list')) {

                    let periodos = $(this).find('.periodos').html()
                    $(this).find('.periodos').html(parseInt(periodos) + 1)
                    materiasIguais++
                }
            }
        }
    })
    if (materiasIguais > 0) { //Se ainda possui materia desse tipo na lista
        $('.materia-arrived').remove()
    } else if (materiasIguais == 0 && materiaDragging.parentNode != document.querySelector('.materias-list')) { //Se chegou uma nova

        $('.materias-list').append(materiaDragging)
        $('.materia-arrived').removeClass('materia-arrived')
        estiloPadraoMaterias(materiaDragging, 0)
    }


    updateJson()

    $('.materias-drop-area').hide()
}


function estiloPadraoMaterias(element, periodosNecessarios) {
    var corMateria = $(element).find('.materia-color').css('background-color')
    let corFonte = $(element).attr('data-font-color')
    const corDeFundoPadrao = '#f4f4f4'

    $(element).append(`<div class='periodos'>${periodosNecessarios}</div>`)

    $(element).find('.materia-professor').css('background-color', corDeFundoPadrao)
    $(element).find('.materia-color, .periodos').css('background-color', corMateria)
    $(element).find('.materia-professor').children().css('color', 'black')
    $(element).find('.periodos').css('color', corFonte)
}

function styleDropped(element) {
    var corDaMateria = $(element).find('.materia-color').css('background-color')


    const LIGHTENESS = 120

    $(element).find('.periodos').remove()
    corDaMateria = rgbToHex(corDaMateria)
    $(element).find('.materia-professor').css('background-color', LightenDarkenColor(corDaMateria, LIGHTENESS))
    let corFonte = invertColor(corDaMateria, true)
    $(element).addClass('materia-inside')
}

function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function rgbToHex(color) {
    color = "" + color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }
    if (color.charAt(0) == "#") {
        return color;
    }
    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);
    return "#" + (
        (r.length == 1 ? "0" + r : r) +
        (g.length == 1 ? "0" + g : g) +
        (b.length == 1 ? "0" + b : b)
    );
}


//Eu tava me confundi no ingreis dai coloquei essas variaveis em pt-br
var curso = null
var turma = null

function selectCursosTecnicos() {
    
    if(json['Cursos'].length == 0){
        alert('Nenhuma curso cadastrado!')
       
            window.location.href = "../../Gerenciamento/cursos/edicao-cursos.html"
        
        
    }
    for (let key in json['Cursos']) {

        $('.tecnicos').append("<option values='" + key + "'>" + key + "</option>")
    }
    $('.tecnicos').change(function () {
        curso = $(this).val()
        fillTurmaSelect(curso)
        cleanAll()
        $('.materia-each-container:not(.loading)').each(function () {
            var elemento = $(this)
            elemento.remove()
        })
        $('.tools-container .tecnicos').val(curso)
        $('.cursos').attr('disabled', false)
    })
}

function fillTurmaSelect(cursoTecnico) {
    $('.cursos').children().each(function () {
        var elemento = $(this)
        elemento.remove()
    })
    $('.cursos').append("<option value='-1' disabled selected>Selecione...</option>")

    
    for (var key in json['Cursos'][cursoTecnico]) {
        $('.cursos').append("<option values='" + key + "'>" + key + "</option>")
    }

}

function selectTurma() {
    $('.cursos').change(function () {
        turma = $(this).val()

        changeCourse(curso, turma, true)
        hideSelectCurso()
    })
}


var jsonhorarios;

function changeCourse(cursoTecnico, turma, reload) {

    $('.tools-container .cursos').val(turma)

    $('.materia-each-container').each(function () {
        var elemento = $(this)
        elemento.remove()
    })
    //carrega o JSON dos horários


    $.getJSON({
        url: '../../horarios.json',
        cache: false,
        success: function (data) {

            jsonhorarios = data

        },
        error: function () {

            $.ajax({
                url: 'criaJSON.php',
                cache: false
            }).done(function () {
                changeCourse(cursoTecnico, turma, true)
            })
        }


    }).done(function () {
        if(!json['Cursos'][cursoTecnico][turma]['materias']){
            alert('Nenhuma matéria cadastrada!')
           
                window.location.href = "../../Gerenciamento/materias/edicao-materias.html"
            
            
        }
        for (var i = 0; i < json['Cursos'][cursoTecnico][turma]['materias'].length; i++) {
            var materia = json['Cursos'][cursoTecnico][turma]['materias'][i]
            var horariosexistentes;

            if (turma in jsonhorarios) {
                horariosexistentes = jsonhorarios[turma][materia['nome']]


            } else {
                horariosexistentes = null;
            }

            const cargahoraria = materia['ch']
            var cargahorarianecessaria = materia['ch']
            if (horariosexistentes != null) {

                horariosexistentes['periodos'].forEach(function (valor) {

                    $('.class-period').each(function () {
                        if ($(this).attr('data-period') == valor) {
                            $(this).append("<div draggable='true' class='materia-each-container' id='professor_" + materia['codprof'] + "_" + (i + 1) + "'datacodprof='" + materia['codprof'] + "'></div>")
                            $(this).children().last().append("<div class='materia-color'></div>", "<div class='materia-professor'></div>")
                            $(this).children().last().children().last().append("<div class='materia-name'>" + materia['nome'] + "</div>")
                            $(this).children().last().children().last().append("<div class='professor-name'>" + json['Professores'][materia['codprof']]['nome'] + "</div>")
                            $(this).children().last().append("<div class='periodos'>" + cargahorarianecessaria + "</div>")


                            cargahorarianecessaria--
                        }
                    })
                })
            }
            if (cargahorarianecessaria > 0) {
                $('.materias-list').append("<div draggable='true' class='materia-each-container' id='professor_" + materia['codprof'] + "_" + (i + 1) + "'datacodprof='" + materia['codprof'] + "'></div>")
                $('.materias-list').children().last().append("<div class='materia-color'></div>", "<div class='materia-professor'></div>")
                $('.materias-list').children().last().children().last().append("<div class='materia-name'>" + materia['nome'] + "</div>")
                $('.materias-list').children().last().children().last().append("<div class='professor-name'>" + json['Professores'][materia['codprof']]['nome'] + "</div>")
                $('.materias-list').children().last().append("<div class='periodos'>" + cargahorarianecessaria + "</div>")
            }
        }

        $('.materia-each-container').each(function () {

            if (reload) {
                $(this).fadeIn('slow')
            }
            $(this).css('display', 'flex')
        })

        sortBackgroundColor()
        addDraggingEvents()

        $('.class-period').children().each(function () {
            styleDropped($(this))
        })
    })
}

function showBlocks(elemento) { //Pega a materia que quer mostrar os bloqueios
    var materia = $(elemento).find('.materia-name').html() //Pega o nome dessa materia
    materia = materia.trim() //Tira os espaços que ficam antes e depois Ex "       Hello World            "
    curso = $('.tools-container .tecnicos').val()
    turma = $('.tools-container .cursos').val()
    for (let i = 0; i < json["Cursos"][curso][turma]["materias"].length; i++) { //Percorre as materias do curso e turma escolhida
        let materiaSendoComparada = (json["Cursos"][curso][turma]["materias"][i]["nome"]).trim()
        if (materiaSendoComparada == materia) { //Se achar uma que seja igual a materia passada como parametro da funcao
            var index = i //Salva o index
        }
    }
    var codProf = json["Cursos"][curso][turma]["materias"][index]["codprof"] //Com o index de antes, pega o codigo do professor dessa materia
    let blocks = json["Professores"][codProf]["bloqueios"] //Coloca os bloqueios numa variavel, ja entra como vetor
    $(blocks).map(function (index, value) { //Percorre esse vetor com bloqueios (mesma coisa que for(i=0; )..........)
        //No map acima, o segundo parametro são os valores do array, o primeiro é sempre o index [1,2,3,4], por isso so uso o value nesse caso
        $('.table-cel').each(function () { //Percorre todas as celulas da tabela
            if ($(this).attr('data-period') == value) { //Se alguma tiver o atributo 'data-period' igual a algum dos periodos bloqueados
                $(this).addClass('blocked') //Coloca a cor dessa celula em vermelho
            }
        })
    })
}

function removeBlock(periodo, professor) {

    $.ajax({
        url: 'removeBloqueio.php',
        method: 'POST',
        cache: false,
        data: {
            periodo,
            professor
        }
    }).done(function (resposta) {

    })
}

function hideBlocks() {
    $('.table-cel').each(function () {
        if ($(this).hasClass('blocked')) {
            $(this).removeClass('blocked')
        }
    })
}

function hideSelectCurso() {
    $('.fundo-preto').hide()
    $('.escolha-curso').fadeOut('slow')
}

function cleanAll() {
    $('.table-cel').each(function () {
        $(this).children().remove()
    })
}

function trashButton() {
    $(`.table-cel`).each(function () {
        var materia = $(this).children()
        if (materia.hasClass('materia-each-container')) {
            
            colocaMateriaDeVolta(materia)
           
            $(this).children().remove()
        }
    })
    
    updateJson()
    

}

function searchWord() {
    var pesquisa = $('#searchInput').val()
    $('.materia-each-container').each(function () {
        var sendoComparado = $(this).find('.materia-name').html()
        sendoComparado = formatToCompare(sendoComparado)
        pesquisa = formatToCompare(pesquisa)
        if (sendoComparado == pesquisa.trim()) {
            $(this).css('box-shadow', '0px 0px 4px 8px #0094FF')
        }
    })
    setTimeout(function () {
        $('.materia-each-container').each(function () {
            $(this).css('box-shadow', 'none')
        })
    }, 1000)
}

function formatToCompare(string) {
    string = string.trim()
    string = string.toUpperCase()
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return string
}

function printPage() {
    curso = $('.tools-container .tecnicos').val()
    turma = $('.tools-container .cursos').val()
    let data = new Date()
    let ano = data.getFullYear()
    let tituloImpressao = `Técnico em ${curso} | ${turma} | ${ano}`
    $('.nome-curso-print').html(tituloImpressao)
    window.print()
}


function turnosCheckboxes() {
    $('.checkbox input').click(function () {

        let turno = $(this).val()
        if ($(this).next().hasClass('checked')) {
            if (($('.checkmark.checked').length) == 1) {
                $('#alertaTurnos').show()
                $('#alertaTurnos').fadeOut(1500)
            } else {

                $(this).next().removeClass('checked')
                removeTurno(turno)

            }
        } else {
            $(this).next().addClass('checked')


            renderizaTurno(turno)
            cursoTecnico = $('.tools-container .tecnicos').val()
            turma = $('.tools-container .cursos').val()

            changeCourse(cursoTecnico, turma, false)
        }
    })
}

function createTable() {
    var diasSemana = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira"];
    for (let i = -1; i < diasSemana.length; i++) {
        if (i == -1) {
            let coluna = `<div class='coluna'><div class='horario-cel'></div>`
            $('.tabela-horarios').append(coluna)
            continue
        }
        let coluna = `<div class='coluna'><div class='semana-title'>${diasSemana[i]}</div>`
        $('.tabela-horarios').append(coluna)
    }
}

function renderizaTurno(turno) {

    const horarios = {
        Manhã: ["07:30 - 08:20", "08:20 - 09:10", "09:10 - 10:00", "10:10 - 11:00 ", " 11:00 - 11:50"],
        Tarde: ["13:10 - 14:00", " 14:00 - 14:50 ", " 14:50 - 15:40 ", " 15:50 - 16:40", "16:40 - 17:30"],
        Noite: ["17:55 - 18:45 ", " 18:45 - 19:35 ", " 19:35 - 20:25", " 20:35 - 21:25 ", " 21:25 - 22:15"]
    }
    var colunaHorarios = ''
    var celulasTabela = ''
    horarios[turno].forEach(function (horario) {
        colunaHorarios += `<div class='horario-cel ${turno}'>${horario}</div>`
        celulasTabela += `<div class='table-cel class-period ${turno}'></div>`
        //$('.coluna').eq(0).append(`<div class='horario-cel ${turno}'>${horario}</div>`)
        //$('.coluna').not(':first-of-type').append(`<div class='table-cel class-period ${turno}'></div>`)
    })
    if (turno == 'Manhã') {
        $(colunaHorarios).insertAfter($('.horario-cel').first())
        $(celulasTabela).insertAfter($('.coluna').children('.semana-title'))
    }
    if (turno == 'Tarde') {
        if ($('.table-cel').hasClass('Manhã')) {
            $(colunaHorarios).insertAfter($('.horario-cel.Manhã').last())
            $('.coluna').each(function () {
                $(celulasTabela).insertAfter($(this).not(':first-of-type').children('.Manhã').last())
            })
            ///$(celulasTabela).insertAfter($('.coluna').children('.Manhã').last())
        } else {
            $(colunaHorarios).insertAfter($('.horario-cel').first())
            $(celulasTabela).insertAfter($('.coluna').children('.semana-title'))
        }
    }
    if (turno == 'Noite') {
        $('.coluna').eq(0).append(colunaHorarios)
        $('.coluna').not(':first-of-type').append(celulasTabela)
    }

    addDraggingEvents()
    calculatePeriods(turno)
}



function colocaMateriaDeVolta(materia) {

    periodoCelulaAnterior = $(materia).parent().attr('data-period')
    professorCelulaAnterior = $(materia).attr('datacodprof')

    if (periodoCelulaAnterior) {
        removeBlock(periodoCelulaAnterior, professorCelulaAnterior)
    }
    $(materia).addClass('materia-arrived')
    $(materia).removeClass('materia-inside')
    let nomeDaMateria = materia.find('.materia-name').html()
    let nomeProfessor = materia.find('.professor-name').html()
    let materiasIguais = 0
    $('.materias-list .materia-each-container').each(function () {
        let professorSendoTestado = $(this).find('.professor-name').html()
        let nomeMateriaSendoTestada = $(this).find('.materia-name').html()
        if (nomeDaMateria == nomeMateriaSendoTestada) {
            if (nomeProfessor == professorSendoTestado) { //Necessario pois há a possibilidade de haver 2 materias com o mesmo nome (3 ENO) 

                let periodos = $(this).find('.periodos').html()
                $(this).find('.periodos').html(parseInt(periodos) + 1)
                materiasIguais++
            }
        }
    })
    if (materiasIguais == 0) {
        $('.materias-list').append(materia)
        $('.materia-arrived').removeClass('materia-arrived')
        estiloPadraoMaterias(materia, 1)
    }


}

function calculatePeriods(turno) {
    if (turno == 'Manhã') var periodos = 1
    if (turno == 'Tarde') var periodos = 6
    if (turno == 'Noite') var periodos = 11
    $(`.table-cel.${turno}`).each(function () {
        $(this).attr('data-period', periodos)
        periodos % 5 == 0 ? periodos += 11 : periodos++
    })
}

function removeTurno(turno) {
    $(`.${turno}`).each(function () {
        $(this).remove()
    })
}


$(function () {
    createTable()
    renderizaTurno("Manhã")
    renderizaTurno("Tarde")
    turnosCheckboxes()
    selectTurma()

})