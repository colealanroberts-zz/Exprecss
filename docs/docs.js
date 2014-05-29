var arr = ['mobile optimized', 'beautifully simple', 'scalable front-end', 'lightweight responsive'];
var i = 0;
var len = arr.length;
var $el = $('#description-rotate');
var $temp = $('<span />');

$temp.hide().appendTo($el.parent());

function loop() {
    var width = $temp.text(arr[i%=len]).width();
    $el.fadeTo(1000, 0).animate({
        width: width
    }, 300, function() {
        $(this).text(arr[i++]).fadeTo(1000, 1);
    });
    setTimeout(loop, 4000);
}

$(document).ready(function() {
    loop(0);
});