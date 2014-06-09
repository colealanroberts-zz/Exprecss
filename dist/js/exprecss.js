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

	var app = angular.module('exprecss', []).run(function() {

	});

	app.service('$expModal', function($compile) {
		var overlay = angular.element('<div class="modal-overlay"></div>'),
			overlayVisible = false,
			$body = angular.element('body'),
			registry = {},
			i = 0;

		this.showOverlay = function(listener) {
			if (!overlayVisible) {
				$body.append(overlay);
				overlayVisible = true;

				if (angular.isFunction(listener)) {
					overlay.on('click', listener);
				}
			}
		};

		this.hideOverlay = function(listener) {
			if (overlayVisible) {
				overlay.remove();
				overlayVisible = false;

				if (angular.isFunction(listener)) {
					overlay.off('click', listener);
				}
			}
		};

		this.register = function(options, scope) {
			var _options = angular.extend({
				title: "Modal Title",
				html: "Modal Html"
			}, options);

			registry[i] = $compile(angular.element('<div exp-modal-open="isOpen" exp-modal="'+_options.title+'">'+_options.html+'</div>'))(scope);

			$body.append(registry[i]);

			return i++;
		};

		this.deregister = function(key) {
			$body.remove(registry[key]);
			delete registry[key];
		}
	});

	app.directive('expModal', function($expModal) {
		return {
			restrict: 'AE',
			scope: {
				title: '@expModal',
				open: '=expModalOpen'
			},
			templateUrl: 'dist/templates/modal.html',
			replace: true,
			transclude: true,
			link: function(scope, elem, attr) {
				var overlayListener = function() {
					scope.open = false;
					scope.$apply();
				}

				scope.$watch('open', function(val) {
					if (val) {
						$expModal.showOverlay(overlayListener);
					} else {
						$expModal.hideOverlay(overlayListener);
					}
				});

				scope.close = function() {
					scope.open = false;
				}
			}
		}
	});

	app.directive('expModalClick', function($expModal) {
		return {
			restrict: "A",
			scope: {
				title: '@expModalClick',
				html: '@expModalClickHtml'
			},
			link: function(scope, elem, attr) {
				scope.isOpen = false;

				var registryKey = $expModal.register({
					title: scope.title,
					html: scope.html
				}, scope);

				elem.on('click', function(e) {
					e.preventDefault();

					scope.isOpen = true;
					scope.$apply();
				});

				scope.$on('$destroy', function() {
					$expModal.deregister(registryKey);
				});
			}
		}
	});

	app.directive('expMask', function($log) {
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

		/* Get next position for cursor by number index

		 * ex. For mask: 0000-0000
		 * return [1,2,3,5,6,7,8,9]
		 *
		 * ex. For mask: (000) 000-0000
		 * return [2,3,6,7,9,10,11,12,13,14]
		 */
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

			// Double up the last value to prevent index out of range bugs
			indexArr.push(indexArr[indexArr.length - 1]);

			return indexArr;
		}


		return {
			restrict: 'A',
			scope: true,
			link: function(scope, elem, attr) {
				var mask = attr['expMask'],
					charPositions = nextPositions(mask),
					strPositions = whichChars(mask);

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