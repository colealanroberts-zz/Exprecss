(function () {
    'use strict';

    var app = angular.module('exprecss', []).run(function ($rootScope, $expConfirm, $document) {
        $document.on('click', function (e) {
            if (e.target.className &&
                (e.target.className.indexOf('btn-responsive-nav') >= 0 ||
                e.target.className.indexOf('btn-responsive-nav-close') >= 0)) {
                angular.element($document[0].querySelector('.navbar ul')).toggleClass('nav-close nav-open');
                e.preventDefault();
            }
        });

        $document.on('click', function (e) {
            if (e.target.className &&
                e.target.className.indexOf('btn-dropdown') >= 0) {
                var that = angular.element(e.target),
                    menu = angular.element($document[0].querySelector('#' + that.attr('data-for') || that.attr('for')));

                e.preventDefault();
                menu.toggleClass('dropdown-menu-container-inactive dropdown-menu-container-active');
                that[0].focus();

                menu.one('mousedown', function (ev) {
                    ev.target.click();
                });

                that.one('blur', function () {
                    menu.removeClass('dropdown-menu-container-active');
                    menu.addClass('dropdown-menu-container-inactive');
                });
            }
        });

        $rootScope.errorConfirm = function () {
            $expConfirm('Error', 'Something real bad just now!', 'Freak out', 'Ignore').then(function () {
                alert('You freaked out');
            }, function () {
                alert('You ignored it');
            });
        };

        $rootScope.errorAlert = function () {
            $expConfirm('Error', 'Something real bad just now!', 'Whatever').then(function () {
                alert('You dismissed alert');
            });
        };
    });

    app.service('$expModal', function () {
        var beforeShowListener = null;

        this.beforeShowListener = function () {
            if (beforeShowListener) {
                beforeShowListener();
            }
        };

        this.setBeforeShowListener = function (listener) {
            beforeShowListener = listener;
        };
    });

    app.factory('$expAlertServerError', function ($expConfirm) {
        return function () {
            return $expConfirm('Error', 'An unexpected error has occurred.', 'Okay', null, {headerClass: 'modal-header-important'});
        }
    });

    app.factory('$expConfirm', function ($q, $rootScope, $compile, $expModal, $document, $sce, $timeout) {
        var $expConfirm = function (title, html, confirmText, cancelText, options) {
            var deferred = $q.defer(),
                scope = $rootScope.$new(),
                $body = angular.element($document[0].body);

            options = options || {};

            var _options = angular.extend({
                headerClass: 'modal-header-info',
                confirmClass: 'btn-primary',
                cancelClass: 'btn-primary'
            }, options);

            angular.extend(scope, {
                title: title,
                html: $sce.trustAsHtml(html),
                confirmText: confirmText || 'Okay',
                cancelText: cancelText,
                headerClass: [_options.headerClass],
                confirmClass: [_options.confirmClass],
                cancelClass: [_options.cancelClass],
                open: true
            });

            var confirmModal = $compile(angular.element('<div exp-confirm></div>'))(scope, function (elem) {
                    $body.append(elem);
                }),
                cancel = function () {
                    scope.$destroy();
                    $timeout(function () {
                        confirmModal.remove();
                        $document.off('keypress', handleKeyPress);
                        deferred.reject();
                    }, 0);
                },
                confirm = function () {
                    scope.$destroy();
                    $timeout(function () {
                        confirmModal.remove();
                        $document.off('keypress', handleKeyPress);
                        deferred.resolve();
                    }, 0);
                },
                handleKeyPress = function (e) {
                    if (cancelText && e.which === 27) {
                        e.preventDefault();
                        cancel();
                    } else if (e.which === 13 || e.which === 27) {
                        e.preventDefault();
                        confirm();
                    }
                };

            angular.extend(scope, {
                cancel: cancel,
                confirm: confirm,
                close: scope.cancelText ? cancel : confirm
            });

            $document.on('keypress', handleKeyPress);

            $expModal.beforeShowListener();

            return deferred.promise;
        };

        return $expConfirm;
    });

    app.directive('expConfirm', function () {
        return {
            restrict: 'AE',
            template: '' +
            '<div class="modal" ng-if="open" id="exp-confirm-modal">\n' +
            '   <div class="modal-overlay" ng-click="close()"></div>\n' +
            '   <div class="modal-content">\n' +
            '       <div class="modal-header" ng-class="::headerClass">{{ ::title }}</div>\n' +
            '       <div class="modal-body" ng-bind-html="::html">\n' +
            '       </div>\n' +
            '       <div class="modal-footer">\n' +
            '           <a class="btn float-left" id="cancel-modal-btn" ng-class="::cancelClass" ng-if="::cancelText" ng-click="cancel()">{{ ::cancelText }}</a>\n' +
            '           <a class="btn float-right" id="confirm-modal-btn" ng-class="::confirmClass" ng-click="confirm()">{{ ::confirmText }}</a>\n' +
            '       </div>\n' +
            '   </div>\n' +
            '</div>',
            link: function (scope, elem, attr) {
            }
        }
    });

    app.directive('expModal', function () {
        return {
            restrict: 'AE',
            scope: {
                title: '@expModal',
                open: '=expModalOpen'
            },
            template : '' +
            '<div class="modal" ng-if="open">' +
            '    <div class="modal-overlay" ng-click="close()"></div>' +
            '    <div class="modal-content">' +
            '        <div class="modal-header modal-header-info">{{ title }}</div>' +
            '        <div class="modal-body" ng-transclude></div>' +
            '        <div class="modal-footer">' +
            '            <a id="btn-okay" class="btn btn-primary float-right" ng-click="close()">Okay</a>' +
            '        </div>' +
            '    </div>' +
            '</div>',
            transclude: true,
            link: function (scope) {
                scope.close = function () {
                    scope.open = false;
                }
            }
        }
    });

    app.directive('expMask', function ($log) {
        var maskPattern = /[\(\)\[\]0-9\-\s]+/,
            separators = /[\(\)\[\]\s\-]/g,
            separator = /[\(\)\[\]\s\-]/;

        var applyMask = function (charArray, mask) {
            var i = 0, len = charArray.length, result = '', mlen = mask.length;
            for (var n = 0; n < mlen; n++) {
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
        };

        // Get plain number array
        var clean = function (str) {
            return str.replace(separators, '').split('');
        };

        /* Get next position for cursor by number index

         * ex. For mask: 0000-0000
         * return [1,2,3,5,6,7,8,9]
         *
         * ex. For mask: (000) 000-0000
         * return [2,3,6,7,9,10,11,12,13,14]
         */
        var nextPositions = function (mask) {
            var posArr = [];
            for (var n in mask) {
                if (!separator.test(mask[n])) {
                    posArr.push(+n);
                }
            }

            posArr.push(posArr[posArr.length - 1] + 1);
            posArr.shift();

            return posArr;
        };

        // Get indexes for numbers by string position
        var whichChars = function (mask) {
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
        };


        return {
            restrict: 'A',
            scope: true,
            require: '?ngModel',
            link: function (scope, elem, attr, ngModel) {
                var mask = attr['expMask'],
                    charPositions = nextPositions(mask),
                    strPositions = whichChars(mask);

                if (!maskPattern.test(mask)) {
                    $log.error("Invalid mask for input")
                }

                if (ngModel) {
                    ngModel.$render = function () {
                        if (angular.isString(ngModel.$modelValue)) {
                            elem.val(applyMask(clean(ngModel.$modelValue), mask));
                        }
                    };
                }

                elem.on('keydown', function (e) {
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

                        var maskedValue = applyMask(clean(str), mask);
                        elem.val(maskedValue);

                        if (ngModel) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(maskedValue);
                            });
                        }

                        elem[0].selectionStart = elem[0].selectionEnd = final;
                    }
                });

                elem.on('keypress', function (e) {
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

                    var maskedValue = applyMask(clean(str), mask);
                    elem.val(maskedValue);

                    if (ngModel) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(maskedValue);
                        });
                    }

                    elem[0].selectionStart = elem[0].selectionEnd = charPositions[strPositions[start]];
                });
            }
        }
    })
}());
