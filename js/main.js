function responsiveNav() {
    $('.navbar ul').toggleClass('nav-close nav-open');
}

$(document).ready(function() {
    $('.btn-responsive-nav').on('click', function(e) {
        responsiveNav();
        e.preventDefault();
    });
});