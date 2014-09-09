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
    nodeDepth(dev);
});

