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
    $(window).on('scroll', navScroll);
});