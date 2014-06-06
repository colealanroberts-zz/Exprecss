function toggleModal() {
    $('#modal-example').on('click', function(e) {
        e.preventDefault();
        $('body').append('<div class="modal-overlay"></div');
        $('.modal').toggleClass('modal-hide modal-open');
    });
}
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

    // Modal
    toggleModal();
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
				var c = mask.charAt(n);

				if (separator.test(c)) {
					result += c;
				} else {
					if (i >= len) {
						break;
					}

					result += charArray[i++];
				}
			}

			return result;
		}

		// Get plain number array
		var clean = function(str) {
			return str.replace(separators, '').split('');
		}

		// Get positions for cursor by number index
		var nextPositions = function(mask) {
			var posArr = [];
			for (var n in mask) {
				if (!separator.test(mask[n])) {
					posArr.push(+n);
				}
			}

			posArr.push(posArr[posArr.length - 1] + 1);
			posArr.shift()

			return posArr;
		}

		// Get indexes for numbers by string position
		var whichChars = function(mask) {
			var i = 0, indexArr = [];
			for (var n in mask) {
				indexArr.push(i);

				if (!separator.test(mask[n])) {
					i++
				}
			}

			return indexArr;
		}


		return {
			restrict: 'A',
			scope: true,
			link: function(scope, elem, attr) {
				var mask = attr['exMask'],
					charPositions = nextPositions(mask),
					strPositions = whichChars(mask);

				console.log(charPositions, strPositions);

				if (!maskPattern.test(mask)) {
					$log.error("Invalid mask for input")
				}

				var remask = function (char) {

				}

				elem.on('keydown', function(e){
					if (e.which === 8) {
						e.preventDefault();

						var start = elem[0].selectionStart,
							end = elem[0].selectionEnd,
							selection = end - start,
							str = elem.val(),
							arr, final;

						if (selection === 0) {
							(arr = str.split('')).splice(start - 1, 1);
							str = arr.join('');
							final = start - 1;
						} else {
							(arr = str.split('')).splice(start, selection);
							str = arr.join('');
							final = start;
						}

						elem.val(applyMask(clean(str), mask));

						elem[0].selectionStart = elem[0].selectionEnd = final;
					}
				});

				elem.on('keypress', function(e){
					e.preventDefault();

					var start = elem[0].selectionStart,
						end = elem[0].selectionEnd,
						selection = end - start,
						str = elem.val(),
						arr;

					var char = String.fromCharCode(e.which);
					if (/[0-9]/.test(char)) {
						if (selection === 0) {
							(arr = str.split('')).splice(start, 0, char);
							str = arr.join('');
						} else {
							(arr = str.split('')).splice(start, selection, char);
							str = arr.join('');
						}
					}

					elem.val(applyMask(clean(str), mask));

					elem[0].selectionStart = elem[0].selectionEnd = charPositions[strPositions[start]];
				});
			}
		}
	})
}());