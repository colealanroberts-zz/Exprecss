function responsiveNavOpen() {
    $('.navbar ul').toggleClass('nav-close nav-open');
}

function responsiveNavClose() {
    $('.navbar ul').toggleClass('nav-close nav-open');
}

$(document).ready(function() {
    $('.btn-responsive-nav').on('click', function(e) {
        responsiveNavOpen();
        e.preventDefault();
    });
    $('.btn-responsive-nav-close').on('click', function(e) {
        responsiveNavClose();
        e.preventDefault();
    });
});