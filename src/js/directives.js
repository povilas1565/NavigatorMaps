'use strict';

angular.module('navigatorMaps').

// directive('', ['', function () {
// 	// Runs during compile
// 	return {
// 		name: '',
// 		priority: 1,
// 		terminal: true,
// 		scope: {}, // {} = isolate, true = child, false/undefined = no change
// 		controller: function ($scope, $element, $attrs, $transclude) {},
// 		require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
// 		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
// 		template: '',
// 		templateUrl: '',
// 		replace: true,
// 		transclude: true,
// 		compile: function (tElement, tAttrs, function transclude(function (scope, cloneLinkingFn) {
// 			return function linking(scope, elm, attrs) {}
// 		})),
// 		link: function ($scope, iElm, iAttrs, controller) {

// 		}
// 	};
// }]).


// form-input.js
directive('forminput',
	function ($compile) {
		var watcherFor = function (form, name) {
			return function () {
				if (name && form[name]) {
					return form[name].$invalid;
				}
			};
		};

		var updaterFor = function (elm) {
			return function (hasError) {
				if (hasError) {
					elm.removeClass('has-success').addClass('has-error');
				} else {
					elm.addClass('has-success').removeClass('has-error');
				}
			};
		};

		return {
			restrict: 'A',
			require: '^form',
			link: function (scope, elm, attrs, form) {
				var name = attrs.forminput;
				var messages = '<div class="help-block" ng-messages="' + form.$name + '.' + name + '.$error' + '">' +
					'<span ng-message="required">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'This field is required' + '}}</span>' +
					'<span ng-message="min">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Too small' + '}}</span>' +
					'<span ng-message="max">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Too large' + '}}</span>' +
					'<span ng-message="url">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid URL' + '}}</span>' +
					'<span ng-message="date">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid date' + '}}</span>' +
					'<span ng-message="time">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid time' + '}}</span>' +
					'<span ng-message="week">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid week' + '}}</span>' +
					'<span ng-message="month">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid month' + '}}</span>' +
					'<span ng-message="datetime-local">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid datetime</span>' +
					'<span ng-message="email">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid email' + '}}</span>' +
					'<span ng-message="pattern">{{' + (form.$name + '.' + name + '.errorMessage') ? form.$name + '.' + name + '.errorMessage' : 'Enter a valid email' + '}}</span>' +
					'<span ng-message="async">{{' + form.$name + '.' + name + '}}</span>' +
					'<div>';
				elm.append($compile(messages)(scope));
				scope.$watch(watcherFor(form, name), updaterFor(elm));
			}
		};
	}
).


// validation
directive('validation', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function (viewValue) {
				var validation = scope[attrs.validation];
				console.log(validation, viewValue);
				if (scope.message.indexOf(viewValue) !== -1) {
					ctrl.$setValidity('message', false);
					return undefined;
				} else {
					ctrl.$setValidity('message', true);
					return viewValue;
				}
			});
		}
	};
}).

/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels. 
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

directive('paneltool', function ($compile, $timeout) {
	var templates = {
		/* jshint multistr: true */
		collapse: '<a href=\'#\' panel-collapse=\'\' data-toggle=\'tooltip\' title=\'Collapse Panel\' ng-click=\'{{panelId}} = !{{panelId}}\' ng-init=\'{{panelId}}=false\'><em ng-show=\'{{panelId}}\' class=\'fa fa-plus\'></em><em ng-show=\'!{{panelId}}\' class=\'fa fa-minus\'></em></a>',
		dismiss: '<a href=\'#\' panel-dismiss=\'\' data-toggle=\'tooltip\' title=\'Close Panel\'><em class=\'fa fa-times\'></em></a>',
		refresh: '<a href=\'#\' panel-refresh=\'\' data-toggle=\'tooltip\' data-spinner=\'{{spinner}}\' title=\'Refresh Panel\'><em class=\'fa fa-refresh\'></em></a>'
	};

	function getTemplate(elem, attrs) {
		var temp = '';
		attrs = attrs || {};
		if (attrs.toolCollapse) {
			temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
		}
		if (attrs.toolDismiss) {
			temp += templates.dismiss;
		}
		if (attrs.toolRefresh) {
			temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
		}
		return temp;
	}

	return {
		restrict: 'E',
		link: function (scope, element, attrs) {

			var tools = scope.panelTools || attrs;

			$timeout(function () {
				element.html(getTemplate(element, tools)).show();
				$compile(element.contents())(scope);

				element.addClass('pull-right');
			});

		}
	};
}).


/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/
directive('panelDismiss', function ($q) {
	return {
		restrict: 'A',
		controller: function ($scope, $element) {
			var removeEvent = 'panel-remove',
				removedEvent = 'panel-removed';

			$element.on('click', function () {

				// find the first parent panel
				var parent = $(this).closest('.panel');


				function removeElement() {
					var deferred = $q.defer();
					var promise = deferred.promise;

					// Communicate event destroying panel
					$scope.$emit(removeEvent, parent.attr('id'), deferred);
					promise.then(destroyMiddleware);
				}
				removeElement();


				// Run the animation before destroy the panel
				function destroyMiddleware() {
					if ($.support.animation) {
						parent.animo({
							animation: 'bounceOut'
						}, destroyPanel);
					} else {
						destroyPanel();
					}
				}

				function destroyPanel() {

					var col = parent.parent();
					parent.remove();
					// remove the parent if it is a row and is empty and not a sortable (portlet)
					col.filter(function () {
						var el = $(this);
						return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
					}).remove();

					// Communicate event destroyed panel
					$scope.$emit(removedEvent, parent.attr('id'));

				}
			});
		}
	};
}).


/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
directive('panelCollapse', ['$timeout', function ($timeout) {

	var storageKeyName = 'panelState',
		storage;

	function savePanelState(id, state) {
		if (!id) {
			return false;
		}
		var data = angular.fromJson(storage[storageKeyName]);
		if (!data) {
			data = {};
		}
		data[id] = state;
		storage[storageKeyName] = angular.toJson(data);
	}

	function loadPanelState(id) {
		if (!id) {
			return false;
		}
		var data = angular.fromJson(storage[storageKeyName]);
		if (data) {
			return data[id];
		}
	}

	return {
		restrict: 'A',
		controller: function ($scope, $element) {

			// Prepare the panel to be collapsible
			var $elem = $($element),
				parent = $elem.closest('.panel'), // find the first parent panel
				panelId = parent.attr('id');

			storage = $scope.$storage;

			// Load the saved state if exists
			var currentState = loadPanelState(panelId);
			if (typeof currentState !== undefined) {
				$timeout(function () {
						$scope[panelId] = currentState;
					},
					10);
			}

			// bind events to switch icons
			$element.bind('click', function () {

				savePanelState(panelId, !$scope[panelId]);

			});
		}
	};


}]).


/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/
directive('panelRefresh', function () {

	return {
		restrict: 'A',
		controller: function ($scope, $element) {

			var refreshEvent = 'panel-refresh',
				whirlClass = 'whirl',
				defaultSpinner = 'standard';

			// method to clear the spinner when done
			function removeSpinner(ev, id) {
				if (!id) {
					return;
				}
				var newid = id.charAt(0) === '#' ? id : ('#' + id);
				angular.element(newid).removeClass(whirlClass);
			}

			// catch clicks to toggle panel refresh
			$element.on('click', function () {
				var $this = $(this),
					panel = $this.parents('.panel').eq(0),
					spinner = $this.data('spinner') || defaultSpinner;

				// start showing the spinner
				panel.addClass(whirlClass + ' ' + spinner);

				// Emit event when refresh clicked
				$scope.$emit(refreshEvent, panel.attr('id'));

			});

			// listen to remove spinner
			$scope.$on('removeSpinner', removeSpinner);
		}
	};
}).


/**=========================================================
 * Module: play-animation.js
 * Provides a simple way to run animation with a trigger
 * Requires animo.js
 =========================================================*/

directive('animate', function () {
	var $scroller = $(window).add('body, .wrapper');
	return {
		restrict: 'A',
		link: function (scope, elem) {
			// Parse animations params and attach trigger to scroll
			var $elem = $(elem),
				offset = $elem.data('offset'),
				delay = $elem.data('delay') || 100, // milliseconds
				animation = $elem.data('play') || 'bounce';

			// Test an element visibilty and trigger the given animation
			function testAnimation(element) {
				var topoffset = $.Utils.isInView(element, {
					topoffset: offset
				});
				if (!element.hasClass('anim-running') && topoffset) {
					element.addClass('anim-running');
					setTimeout(function () {
						element.addClass('anim-done').animo({
							animation: animation,
							duration: 0.7
						});
					}, delay);
				}
			}

			if (typeof offset !== 'undefined') {
				// test if the element starts visible
				testAnimation($elem);
				// test on scroll
				$scroller.scroll(function () {
					testAnimation($elem);
				});

			}

			// Run click triggered animations
			$elem.on('click', function () {

				var $elem = $(this),
					targetSel = $elem.data('target'),
					animation = $elem.data('play') || 'bounce',
					target = $(targetSel);

				if (target && target) {
					target.animo({
						animation: animation
					});
				}

			});
		}
	};
}).


/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

directive('animateEnabled', ['$animate', function ($animate) {
	return {
		link: function (scope, element, attrs) {
			scope.$watch(function () {
				return scope.$eval(attrs.animateEnabled, scope);
			}, function (newValue) {
				$animate.enabled(!!newValue, element);
			});
		}
	};
}]).

/**=========================================================
 * Module: scroll.js
 * Make a content box scrollable
 =========================================================*/
directive('scrollable', function () {
	return {
		restrict: 'EA',
		link: function (scope, elem, attrs) {
			var defaultHeight = 250;
			elem.slimScroll({
				height: (attrs.height || defaultHeight)
			});
		}
	};
}).



/**=========================================================
 * Module: goclick.js
 * Go to URL
 =========================================================*/
directive('goClick', [
	'$location',
	function ($location) {
		return function (scope, element, attrs) {
			var path;
			path = void 0;
			attrs.$observe('goClick', function (val) {
				path = val;
			});
			return element.bind('click', function () {
				scope.$apply(function () {
					$location.path(path);
				});
			});
		};
	}
]);