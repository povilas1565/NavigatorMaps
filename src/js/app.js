'use strict';

if (typeof $ === 'undefined') {
	throw new Error('This application\'s JavaScript requires jQuery');
}

// -------------------------------------------------- //
// -------------------------------------------------- //


// SIMULATING NETWORK LATENCY AND LOAD TIME. We haven't included the ngApp
// directive since we're going to manually bootstrap the application. This is to
// give the  page a delay, which it wouldn't normally have with such a small app.
// SIMULATING NETWORK LATENCY AND LOAD TIME. We haven't included the ngApp 
// directive since we're going to manually bootstrap the application. This is to
// give the  page a delay, which it wouldn't normally have with such a small app.
setTimeout(
	function asyncBootstrap() {
		angular.bootstrap(document, ['navigatorMaps']);
	}, (100)
);

// APP START
// -----------------------------------
var App = angular.module('navigatorMaps', [
	'navigatorConfig',
	'ngAnimate',
	'ngSanitize',
	'ngCookies',
	'ngMessages',
	'ui.bootstrap',
	'ui.router',
	'toaster',
	'oc.lazyLoad',
	'cfp.loadingBar',
	'uiGmapgoogle-maps'
]).
constant('DEBUG', false).
constant('DELAY', 5000).
constant('PERPAGE', [10, 20, 50, 100]);


App.run([
	'$rootScope', '$location', '$state', '$stateParams',
	function ($rootScope, $location, $state, $stateParams) {
		// Set reference to access them from any scope
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		// Scope Globals
		// -----------------------------------
		$rootScope.app = {
			name: 'Navigator',
			shortname: 'Nav',
			description: 'Authentication',
			showLoading: false,
		};
	}
]).

config([
	'$httpProvider',
	function ($httpProvider) {
		$httpProvider.interceptors.push('interceptorService');
	}
]).

factory('interceptorService', [
	'$rootScope', '$q', '$injector', '$location', 'appService',
	function ($rootScope, $q, $injector, $location, appService) {
		var exports;
		exports = {
			request: function (config) {
				config.headers = config.headers || {};
				var authData = appService.get('authorizationData');
				if (authData) {
					config.headers.Authorization = 'Bearer ' + authData.token;
				}
				return config;
			}
		};
		return exports;
	}
]);