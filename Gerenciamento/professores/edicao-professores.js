$.ajaxSetup({
    cache: false
});
$(document).ready(function () {
    
    updateJson()
    buttonsTransition()
    dropdown()

    changeTeacher()

    changeInputFileName()


    removeTeacher()
    // COM CSV

    $("#form").submit(function (event) {
        event.preventDefault()
        var formData = new FormData(this);

        $.ajax({
            url: 'newProfessorCSV.php',
            type: 'POST',
            data: formData,
            success: function (data) {
                alert(data)
            },
            cache: false,
            contentType: false,
            processData: false,
            xhr: function () { // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                    myXhr.upload.addEventListener('progress', function () {
                        /* faz alguma coisa durante o progresso do upload */
                    }, false);
                }
                return myXhr;
            }
        });
    });



})

function removeTeacher() {
    $('#removeTeacher').click(function () {
        if (confirm("Você tem certeza que deseja exluir este professor?")) {


            var codigodoprofessor = $('#código').html()
            $.ajax({
                url: 'removeTeacher.php',
                type: 'POST',
                data: {
                    cod: codigodoprofessor
                }
            }).done(function (success) {
                console.log(success)
                $('.info-container').fadeOut()
                $('.subtitle').fadeOut()
                $('.tabela-horarios').fadeOut()
                $('#professorescolhido').val("")
            })
        }
    })

}


function updateJson() {
    $.getJSON('../../dados.json', function (data) {
        json = data

    }).done(function () {
        $('#listadeprofessores').children().remove()
        for (var key in json['Professores']) {
            $('#listadeprofessores').append("<option value='" + json['Professores'][key]['nome'] + "'></option>")
        }

    })


    $.getJSON('../../horarios.json', function (data) {
        horarioscadastrados = data
    })

}

var professor = null;
var codigo = null;

function changeTeacher() {
    
    $("#professorescolhido").on('input', function () {
        $('.info-container, .subtitle').css('display', 'none')
        $('.tabela-horarios').html('')
        var val = this.value;
        if ($('#listadeprofessores option').filter(function () {
                return this.value.toUpperCase() === val.toUpperCase();
            }).length) {
           // updateJson()
           console.log(json['Professores']['1']['bloqueios'])
            $('.info-container, .subtitle').css('display', 'flex')
            $('.tabela-horarios').html('')
            createTable()
            professor = this.value
            for (var key in json['Professores']) {
                if (json['Professores'][key]['nome'] == professor) {
                    $('#informações').children().html("")
                    $('#nome').html(json['Professores'][key]['nome'])
                    $('#código').html(key)
                    $('#bloqueios').html('')
                    codigo = key;
                    for (var chave in json['Professores'][key]['bloqueios']) {
                        $('#bloqueios').html($('#bloqueios').html() + json['Professores'][key]['bloqueios'][chave])
                        if (chave != (json['Professores'][key]['bloqueios'].length - 1)) {

                            $('#bloqueios').html($('#bloqueios').html() + " - ")
                        }
                    }
                }
            }

        }
        putBlocks()
    })


}


function buttonsTransition() {
    $('.editarprofessor').click(function () {
        updateJson()
        $('.tools-container .editarprofessor').addClass('buttonActive')
        $('.tools-container .adicionarprofessor').removeClass('buttonActive')
        $('#edicao').fadeIn()
        $('.salvar').css('display', 'flex')
        $('#adicao').fadeOut()
    })
    $('.adicionarprofessor').click(function () {
        updateJson()
        $('.tools-container .editarprofessor').removeClass('buttonActive')
        $('.tools-container .adicionarprofessor').addClass('buttonActive')
        $('#adicao').fadeIn()
        $('.tabela-horarios2').html('')
        createTable2()
        $('.salvar').hide()
        $('#edicao').fadeOut()
    })

    $('.main-choice').children().click(function () {
        $('.main-choice').fadeOut(200)
        $('.tools-container').css('display', 'flex')
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
    const horarios = ["07:30 - 08:20", "08:20 - 09:10", "09:10 - 10:00", "10:10 - 11:00 ", " 11:00 - 11:50",
        "13:10 - 14:00", " 14:00 - 14:50 ", " 14:50 - 15:40 ", " 15:50 - 16:40", "16:40 - 17:30",
        "17:55 - 18:45 ", " 18:45 - 19:35 ", " 19:35 - 20:25", " 20:35 - 21:25 ", " 21:25 - 22:15"
    ]
    var colunaHorarios = ''
    var celulasTabela = ''
    horarios.forEach(function (horario) {
        colunaHorarios += `<div class='horario-cel'>${horario}</div>`
        celulasTabela += `<div class='table-cel'></div>`
    })
    $('.coluna').eq(0).append(colunaHorarios)
    $('.coluna').not(':first-of-type').append(celulasTabela)
    calculatePeriods($('.tabela-horarios'))
    addRemoveBlock()
}

function createTable2() { //TABELA 2 (MENOR)
    var diasSemana = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira"];
    for (let i = -1; i < diasSemana.length; i++) {
        if (i == -1) {
            let coluna = `<div class='coluna2'><div class='horario-cel2'></div>`
            $('.tabela-horarios2').append(coluna)
            continue
        }
        let coluna = `<div class='coluna2'><div class='semana-title2'>${diasSemana[i]}</div>`
        $('.tabela-horarios2').append(coluna)
    }
    const horarios = ["07:30 - 08:20", "08:20 - 09:10", "09:10 - 10:00", "10:10 - 11:00 ", " 11:00 - 11:50",
        "13:10 - 14:00", " 14:00 - 14:50 ", " 14:50 - 15:40 ", " 15:50 - 16:40", "16:40 - 17:30",
        "17:55 - 18:45 ", " 18:45 - 19:35 ", " 19:35 - 20:25", " 20:35 - 21:25 ", " 21:25 - 22:15"
    ]
    var colunaHorarios = ''
    var celulasTabela = ''
    horarios.forEach(function (horario) {
        colunaHorarios += `<div class='horario-cel2'>${horario}</div>`
        celulasTabela += `<div class='table-cel'></div>`
    })
    $('.coluna2').eq(0).append(colunaHorarios)
    $('.coluna2').not(':first-of-type').append(celulasTabela)
    calculatePeriods($('.tabela-horarios2'))

    addRemoveBlock()
}


function calculatePeriods(tabela) {
    var periodo = 1
    $(tabela).find('.table-cel').each(function () {
        $(this).attr('data-period', periodo)

        periodo++
    })
}

function putBlocks() {
    $('.table-cel').each(function () {
        var celula = $(this)
        celula.removeClass('bloqueado')
        var bloqueiosdoteacher = json['Professores'][codigo]['bloqueios']
        for (var value in bloqueiosdoteacher) {
            if (celula.attr("data-period") == bloqueiosdoteacher[value]) {
                celula.addClass('bloqueado')
            }
        }
    })
    var bloqueiosdeaula = []
    for (var key in horarioscadastrados) {
        for (var chave in horarioscadastrados[key]) {
            if (horarioscadastrados[key][chave]['professor'] == codigo) {
                bloqueiosdeaula = bloqueiosdeaula.concat(horarioscadastrados[key][chave]['periodos'])
            }
        }
    }

    $('.bloqueado').each(function () {
        var element = $(this)
        for (var key in bloqueiosdeaula) {
            if (bloqueiosdeaula[key] == element.attr("data-period")) {
                element.removeClass('bloqueado')
                element.addClass('bloqueioDeAula')
            }
        }
    })
}

function addRemoveBlock() {
    $('.table-cel').click(function () {
        var element = $(this)
        if (element.hasClass('bloqueado')) {
            element.removeClass('bloqueado')
        } else if (element.hasClass('bloqueioDeAula')) {
            alert('Você não pode retirar um bloqueio de aula')
        } else {
            element.addClass('bloqueado')
        }

    })
}

function editName() {
    $('#nome').css('background-color', 'white').attr('contenteditable', true).focus()
    $('#editNome').html('Salvar')
    $('#editNome').removeClass('btn-primary').addClass('btn-success')
    $('#editNome').attr('onclick', 'saveName()')
}

function saveName() {
    $('#nome').css('background-color', 'transparent').attr('contenteditable', false)
    $('#editNome').html('Editar Nome')
    $('#editNome').addClass('btn-primary').removeClass('btn-success')
    $('#editNome').attr('onclick', 'editName()')
    var novonome = $('#nome').html()
    if (novonome == "") {
        alert('Coloque um nome válido')
    } else {
        $.ajax({
            url: 'newName.php',
            type: 'POST',
            data: {
                nome: novonome,
                cod: codigo
            },
            cache: false,
            success: function (result, status, xhr) {}
        })
    }
}

function saveBlocks() {
    var periodosBloqueados = [];
    $('.table-cel').each(function () {
        var element = $(this)
        if (element.hasClass('bloqueado') || element.hasClass('bloqueioDeAula')) {
            periodosBloqueados.push(element.attr('data-period'))
        }

    })
    $.ajax({
        url: 'newBlocks.php',
        type: 'POST',
        data: {
            bloqueios: periodosBloqueados,
            cod: codigo
        },
        cache: false,

        success: function (result, status) {
            console.log(result)
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
    }).done(function(){
        updateJson()
    })
}


function saveNewTeacherManually() {

    var nome = $('#nomedoprofessor').val()
    var code = $('#codigodoprofessor').val()
    var bloqueios = [];
    $('.tabela-horarios2 .table-cel').each(function () {
        var celula = $(this)
        if (celula.hasClass('bloqueado')) {
            bloqueios.push(celula.attr('data-period'))

        }
    })
    if (code in json['Professores']) {
        alert('Código ja existente')
    }else if(nome == ""){
        alert('Preencha com um nome válido')
    } else {
        $.ajax({
            url: 'newProfessorManual.php',
            type: 'POST',
            data: {
                nomedoprofessor: nome,
                cod: code,
                blocks: bloqueios
            },
            cache: false,
            success: function (result, status, xhr) {}
        })
    }

}


function changeInputFileName() {

    var $input = $('.custom-input-file'),
        $label = $input.prev('label'),
        labelVal = $label.html();

    $input.on('change', function (e) {
        var fileName = '';

        if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else if (e.target.value)
            fileName = e.target.value.split('\\').pop();

        if (fileName)
            $label.find('span').html(fileName);
        else
            $label.html(labelVal);
    });

    // Firefox bug fix
    $input
        .on('focus', function () {
            $input.addClass('has-focus');
        })
        .on('blur', function () {
            $input.removeClass('has-focus');
        });

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