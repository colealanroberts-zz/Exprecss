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
		that.focus();
        e.preventDefault();
    });
	$('body').on('blur', '.btn-dropdown', function(e) {
		var that = $(this),
			menu = $('#' + that.data('for'));


		menu.toggleClass('dropdown-menu-inactive dropdown-menu-active');
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

(function() {
	'use strict';

	var app = angular.module('exprecss', []);

	app.directive('exMask', function($log) {
		var maskPattern = /[\(\)\[\]0-9\-\s]+/,
			separators = /[\(\)\[\]\s\-]/g,
			separator = /[\(\)\[\]\s\-]/;

		var applyMask = function(charArray, mask) {
			var i = 0, len = charArray.length, result = '';
			for (var n in mask) {
				if (i >= len) {
					break;
				}

				var c = mask.charAt(n);

				if (separator.test(c)) {
					result += c;
				} else {
					result += charArray[i++];
				}
			}

			return result;
		}

		var clean = function(str) {
			return str.replace(separators, '').split('');
		}

		return {
			restrict: 'A',
			scope: true,
			link: function(scope, elem, attr) {
				var mask = attr['exMask'],
					charArray = [];

				if (!maskPattern.test(mask)) {
					$log.error("Invalid mask for input")
				}

				elem.on('keydown', function(e){
					if (e.which === 8) {
						e.preventDefault();

						var start = elem[0].selectionStart,
							end = elem[0].selectionEnd,
							selection = end - start,
							str = elem.val(),
							arr;

						console.log(str);
						if (selection === 0) {
							(arr = str.split('')).splice(start - 1, 1);
							str = arr.join('');
						} else {
							(arr = str.split('')).splice(start - 1, selection);
							str = arr.join('');
						}

						elem.val(applyMask(charArray = clean(str), mask));

						elem[0].selectionStart = start;
						elem[0].selectionEnd = start;
					}
				});

				elem.on('keypress', function(e){
					e.preventDefault();

					console.log(e.which);

					var char = String.fromCharCode(e.which);
					if (/[0-9]/.test(char)) {
						charArray.push(char);
					}

					elem.val(applyMask(charArray, mask));
				});
			}
		}
	})
}());