function responsiveNavOpen() {
    $('.btn-responsive-nav').on('click', function(e) {
        $('.navbar ul').toggleClass('nav-close nav-open');
        e.preventDefault();
    });
}

function responsiveNavClose() {
    $('.btn-responsive-nav-close').on('click', function(e) {
        $('.navbar ul').toggleClass('nav-close nav-open');
        e.preventDefault();
    });
}

function dropdownMenu() {
    $('.dropdown-menu').addClass('dropdown-menu-inactive');
    $('body').on('click', '.btn-dropdown', function(e) {
        var that = $(this),
            menu = $('#' + that.data('for'));


        menu.toggleClass('dropdown-menu-inactive dropdown-menu-active');
        e.preventDefault();
    });
}

$(document).ready(function() {
    'use strict';

    // Dropdown
    dropdownMenu();

    // Responsive Nav
    responsiveNavOpen();
    responsiveNavClose();
});