'use strict';
var App = angular.module('navigatorMaps').

/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/
config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES', 'RouteHelpersProvider',
	function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, appRequires, helper) {
		App.controller = $controllerProvider.register;
		App.directive = $compileProvider.directive;
		App.filter = $filterProvider.register;
		App.factory = $provide.factory;
		App.service = $provide.service;
		App.constant = $provide.constant;
		App.value = $provide.value;

		// LAZY MODULES
		// -----------------------------------

		$ocLazyLoadProvider.config({
			debug: false,
			events: true,
			modules: appRequires.modules
		});


		// defaults to dashboard
		$urlRouterProvider.otherwise('/home');

		//
		// Application Routes
		// -----------------------------------
		$stateProvider.state('home', {
				url: '/home',
				title: 'HomePage',
				controller: 'homeCtrl',
				templateUrl: helper.basepath('home.html')
			})
			//
			// CUSTOM RESOLVES
			//   Add your own resolves properties
			//   following this object extend
			//   method
			// -----------------------------------
			// .state('app.someroute', {
			//   url: '/some_url',
			//   templateUrl: 'path_to_template.html',
			//   controller: 'someController',
			//   resolve: angular.extend(
			//     helper.resolveFor(), {
			//     // YOUR RESOLVES GO HERE
			//     }
			//   )
			// })
		;
	}
]).

config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = false;
	cfpLoadingBarProvider.latencyThreshold = 500;
	cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]);