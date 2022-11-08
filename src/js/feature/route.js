'use strict';
angular.module('navigatorMaps').

config([
	'$stateProvider', 'RouteHelpersProvider',
	function ($stateProvider, helper) {
		$stateProvider.state('feature', {
			url: '/feature/:Id',
			title: 'Feature',
			controller: 'FeatureCtrl',
			templateUrl: helper.basepath('feature/feature.html'),
			resolve: {
				Feature: ['$stateParams', 'FeatureService', function ($stateParams, FeatureService) {
					return FeatureService.get($stateParams.Id).then(function (res) {
						return res.data || {};
					});
				}]
			}
		});
	}
]);