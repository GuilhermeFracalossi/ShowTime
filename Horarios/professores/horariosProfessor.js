

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

function changeTeacher(){
    $("#professoresInput").on('input', function () {
        $('.table-cel').html('')
        var codProfessor
        var professorName = $(this).val()
        if ($('datalist option').filter(function () {
                return this.value === professorName;
            }).length) {
        

            for (let cod in jsonDados['Professores']) {
                console.log(jsonDados['Professores'][cod]['nome'], professorName)
                if (jsonDados['Professores'][cod]['nome'].trim() == professorName.trim()) {
                    
                    codProfessor = cod
                }
            }
            
            for (let turma in jsonHorarios) {
                for (let materia in jsonHorarios[turma]) {
                    if (jsonHorarios[turma][materia]['professor'] == codProfessor) {
                        
                        var nomeDaMateria = jsonHorarios[turma][materia]['nomeDaMateria']
                        var periodos = jsonHorarios[turma][materia]['periodos']
                        showTime(turma, nomeDaMateria, periodos)
                    }
                }
            }

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

function calculatePeriods(turno) {
    if (turno == 'Manhã') var periodos = 1
    if (turno == 'Tarde') var periodos = 6
    if (turno == 'Noite') var periodos = 11
    $(`.table-cel.${turno}`).each(function () {
        $(this).attr('data-period', periodos)
        periodos % 5 == 0 ? periodos += 11 : periodos++
    })
}



// function showTime(turma) {
//     let professor = $('#professoresInput').val()
//     let data = new Date()
//     let ano = data.getFullYear()
//     let tituloImpressao = `${professor} | ${ano}`
//     $('.turma-title-print').html(tituloImpressao)
//     $('.table-cel').html('')
//     var turmaEscolhida = turma

//     $('.turma-title').html(``)
//     for (let curso in jsonHorarios[turmaEscolhida]){
//         var materiaName = jsonHorarios[turmaEscolhida][curso]['nomeDaMateria']
//         var periodos = jsonHorarios[turmaEscolhida][curso]['periodos']
//         var codProf = jsonHorarios[turmaEscolhida][curso]['professor']
//         putMateriaOnTable(materiaName, periodos, codProf)
//     }
// sortBackgroundColor()
// }

function showTime(turma, materia, todosPeriodos) {
    let professor = $('#professoresInput').val()
    let data = new Date()
    let ano = data.getFullYear()
    let tituloImpressao = `${professor} | ${ano}`
    $('.professor-title-print').html(tituloImpressao)
    

    todosPeriodos.forEach(function (periodo) {
        $('.table-cel').each(function () {
            if ($(this).attr('data-period') == periodo) {
                var materiaBox = `
                <div class='materia-each-container'>
                        <div class='materia-color'></div>
                        <div class='materia-turma'>
                            <div class='materia-name'>${materia}</div>
                            <div class='turma-name'>${turma}</div>
                        </div>
                        </div>`
                $(this).append(materiaBox)
            }
        })
    })
    sortBackgroundColor()
}

function putMateriaOnTable(materia, todosPeriodos, codProf){
    
    var professorName = jsonDados['Professores'][codProf]['nome']
    
    todosPeriodos.forEach(function(periodo){
        $('.table-cel').each(function () {
            if ($(this).attr('data-period') == periodo) {
                var materiaBox = `
                <div class='materia-each-container'>
                <div class='materia-color'></div>
                    <div class='materia-professor'>
                            
                            <div class='materia-name'>${materia}</div>
                            <div class='professor-name'>${professorName}</div>
                    </div>
                </div>`
                $(this).append(materiaBox)
                
            }
        })

    })
    

}



function sortBackgroundColor() { //sorteia uma cor de fundo para cada materia
    var cores = ['#7dfff0', '#8f87ff', '#d587ff', '#ff87ff',  '#7dd4ff','#e2ff63','#ff8585', '#c7c7c7', '#ffb77d', '#ffe57d', '#7dff86', 
        /*coresescura*/
        '#b63d3d', '#b6613d', '#b6b43d', '#3db649', '#3db6a2', '#3d80b6', '#513db6', '#a63db6', '#b63d67', '#5e5e5e',
    ]


    var turmas = []
    var posicaoCor = 0
    $('.materia-each-container').each(function () {

        //var posicaoCor = Math.floor(Math.random() * cores.length)
        var nomeTurma = $(this).find('.turma-name').html()
        if (turmas.filter(function (turma) {
                return turma.nome == nomeTurma
            }).length == 0) {

            turmas.push({
                nome: nomeTurma,
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
            


        } else {
            turmas.filter(function (turma) {
                if (turma.nome == nomeTurma) {
                    cor = turma.cor
                }
            })

            $(this).find('.materia-color').css('background-color', cor)
            $(this).find('.periodos').css('background-color', cor)

        
        }
    })
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
            
        }
    })
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

   
    calculatePeriods(turno)
}
function removeTurno(turno) {
    $(`.${turno}`).each(function () {
        $(this).remove()
    })
}



function printPage() {
   
    window.print()
}

$(function () {
    createTable()
    changeTeacher()

    renderizaTurno("Manhã")
    renderizaTurno("Tarde")
    turnosCheckboxes()
})