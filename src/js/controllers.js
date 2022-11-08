'use strict';

angular.module('navigatorMaps').

/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

controller('homeCtrl', [
	'$rootScope', '$scope', '$state', '$window', '$timeout', 'cfpLoadingBar',
	function ($rootScope, $scope, $state, $window, $timeout, cfpLoadingBar) {
		// Loading bar transition
		// -----------------------------------
		var thBar;
		// $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		$rootScope.$on('$stateChangeStart', function () {
			if ($('.wrapper > section').length) { // check if bar container exists
				thBar = $timeout(function () {
					cfpLoadingBar.start();
				}, 0); // sets a latency Threshold
			}
		});

		// $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		$rootScope.$on('$stateChangeSuccess', function (event) {
			event.targetScope.$watch('$viewContentLoaded', function () {
				$timeout.cancel(thBar);
				cfpLoadingBar.complete();
			});
		});

		// Hook not found
		// $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
		$rootScope.$on('$stateNotFound', function (unfoundState) {
			console.log(unfoundState.to); // "lazy.state"
			console.log(unfoundState.toParams); // {a:1, b:2}
			console.log(unfoundState.options); // {inherit:false} + default options
		});
		// Hook error
		$rootScope.$on('$stateChangeError',
			function (event, toState, toParams, fromState, fromParams, error) {
				console.log(error);
			});
		// Hook success
		// $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		$rootScope.$on('$stateChangeSuccess', function () {
			// display new view from top
			$window.scrollTo(0, 0);
			// Save the route title
			$rootScope.currTitle = $state.current.title;
		});

		$timeout(function () {
			$rootScope.app.showLoading = false;
		}, (2 * 1000));

		// cancel click event easily
		$rootScope.cancel = function ($event) {
			$event.stopPropagation();
		};
	}
]).

controller('mapToolCtrl', ['$scope', '$state', 'FeatureService', 'MapService', function ($scope, $state, FeatureService, MapService) {
	FeatureService.query().then(function (res) {
		$scope.features = res.data || [];
	});
	MapService.query().then(function (res) {
		var map = '';
		$scope.maps = res.data || [];
		map = $scope.maps[0].id;
		$scope.map = map;
		$scope.goMap(map);
	});

	$scope.goMap = function (id) {
		$state.go('map', {
			Id: id
		});
	};
	$scope.goFeature = function (id) {
		$state.go('feature', {
			Id: id
		});
	};
}]).


controller('mainCtrl', ['$scope', 'toaster', function ($scope, toaster) {
	$scope.$on('success', function (event, msg) {
		toaster.pop('success', '', msg);
	});
	$scope.$on('info', function (event, msg) {
		toaster.pop('info', '', msg);
	});
	$scope.$on('warning', function (event, msg) {
		toaster.pop('warning', '', msg);
	});
	$scope.$on('error', function (event, msg) {
		toaster.pop('error', '', msg);
	});
}]);
