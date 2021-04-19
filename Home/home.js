function showMenu(){
    $('.nav').slideToggle(200)
}

var grausSeta = 0
$('.dropdown').click(function(){
    $(this).find('.arrow-down').toggleClass('upArrow')
    $(this).children('ul').css('visibility', 'visible')
    $(this).children('ul').fadeToggle(0)
})