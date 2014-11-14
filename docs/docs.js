// Apps
var myApp = angular.module("myApp", []);

myApp.controller('MainController', function($scope) { });

myApp.directive('slideToggle', function() {
  return {
    restrict: 'A',
    scope:{},
    controller: function ($scope) {},
    link: function(scope, element, attr) {
      element.bind('click', function() {
        var $slideBox = angular.element(attr.slideToggle);
        var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
        $slideBox.stop().slideToggle(slideDuration);
      });
    }
  };
});

// Simple Validator Exmaple
$(function() {
    $('.btn-validate-me').click(function() {
        $('.validation-text').addClass('animation-validate');
    });
});

function navScroll() {
    var scrollPosition = $(window).scrollTop();
    var $el = $('.sidebar');
    var heroHeight = 462;

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

// Particles JS
particlesJS('particles', {
    particles: {
        color: '#fff',
        shape: 'circle', // "circle", "edge" or "triangle"
        opacity: 0.45,
        size: 2,
        size_random: true,
        nb: 50,
        line_linked: {
            enable_auto: true,
            distance: 250,
            color: '#fff',
            opacity: 0.25,
            width: 1,
            condensed_mode: {
                enable: true,
                rotateX: 800,
                rotateY: 800
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

$(document).ready(function() {
    navScroll();
    $(window).on('scroll', navScroll);
});