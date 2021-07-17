$(document).ready(function(){
$('.has_dropdown').mouseenter(function(){
$('.dropdown').hide();
$(this).children('.dropdown').show();
});

});