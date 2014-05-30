var arr = ['mobile optimized', 'beautifully simple', 'scalable front-end', 'lightweight responsive'];
var i = 0;
var len = arr.length;
var $el = $('#description-rotate');
var $temp = $('<span />');
var dev = true;

function loop() {
    $temp.hide().appendTo($el.parent());
    var width = $temp.text(arr[i%=len]).width();
    $el.fadeTo(1000, 0).animate({
        width: width
    }, 300, function() {
        $(this).text(arr[i++]).fadeTo(1000, 1);
    });
    setTimeout(loop, 4000);
}

function nodeDepth() {
    if (dev == true) {
        var nKey = 78;
        $(document).keydown(function(e) {
            if(e.which == nKey) {$('body').toggleClass('node-depth');
            }
        });
    } else {
        console.log('var dev is set to ' + dev);
    }
}

$(document).ready(function() {
    loop(0);
    nodeDepth();
});

