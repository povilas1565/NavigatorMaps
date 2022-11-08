'use strict';
angular.module('navigatorMaps').

config([
	'$stateProvider', 'RouteHelpersProvider',
	function ($stateProvider, helper) {
		$stateProvider.state('map', {
			url: '/map/:Id',
			title: 'Map',
			controller: 'MapCtrl',
			templateUrl: helper.basepath('map/map.html'),
			resolve: {
				Map: ['$stateParams', 'MapService', function ($stateParams, MapService) {
					return MapService.get($stateParams.Id).then(function (res) {
						return res.data || {};
					});
				}]
			}
		});
	}
]);
