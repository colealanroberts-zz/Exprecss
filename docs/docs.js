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

function introAnim() {
    var $nav = $('.sidebar');
    var $main = $('main');
    var $footer = $('footer');
    var $hero = $('.hero-unit-demo');
    var $heroGroup = $('.hero-group');

    $nav.css({display: 'none'});
    $main.css({display: 'none'});
    $footer.css({display: 'none'});
    setInterval(function() {
        $hero.css({
            position: 'relative',
        });
    }, 3025);

    setInterval(function() {
        $main.css({display: 'block'}).addClass('animation-main-in');
    }, 3200);

    setInterval(function() {
        $nav.css({display: 'block'}).addClass('animation-nav-in');
    }, 3500);

    setInterval(function() {
        $heroGroup.addClass('animation-group-in').css({opacity: 1});
    }, 4000);

    $hero.addClass('animation-overlay-out');
}

function navScroll() {
    var scrollPosition = $(window).scrollTop();
    var $el = $('.sidebar');
    var heroHeight = 393;

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
    navScroll();
    introAnim();
    $(window).on('scroll', navScroll);
});