// Simple Validator Exmaple
$(function() {
    $('.btn-validate-me').click(function() {
        $('.validation-text').addClass('animation-validate');
    });
});

function navScroll() {
    var scrollPosition = $(window).scrollTop();
    var $el = $('.sidebar');
    var heroHeight = 562;

    $(window).scroll(function() {
    	if (scrollPosition > heroHeight) {
    		$el.css({
    			top: 0,
    			position: 'fixed'
    		});
    	} else {
    		$el.css({
    			position: 'relative'
    		});
    	}
    });
}

$(document).ready(function() {
    $(window).on('scroll', navScroll);
});

// Particles JS
particlesJS('particles', {
    particles: {
        color: '#fff',
        shape: 'circle', // "circle", "edge" or "triangle"
        opacity: 0.4,
        size: 1,
        size_random: true,
        nb: 50,
        line_linked: {
            enable_auto: true,
            distance: 250,
            color: '#fff',
            opacity: 0.4,
            width: 1,
            condensed_mode: {
                enable: true,
                rotateX: 600,
                rotateY: 600
            }
        },
        anim: {
            enable: true,
            speed: 0.45
        }
    },
    interactivity: {
        enable: false,
        mouse: {
            distance: 150
        },
        detect_on: 'canvas', // "canvas" or "window"
        mode: 'grab'
    },
    /* Retina Display Support */
    retina_detect: true
});