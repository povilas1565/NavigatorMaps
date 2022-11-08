'use strict';
angular.module('navigatorMaps').

controller('FeatureCtrl', ['$scope', 'Feature', function ($scope, Feature) {
	var features = (Feature && typeof Feature.features !== 'undefined') ? Feature.features : [];

	$scope.map = {
		center: {
			latitude: 52,
			longitude: 4
		},
		pan: true,
		zoom: 12,
		refresh: false,
		events: {},
		bounds: {},
		polys: [],
		getPolyFill: function () {
			return {
				color: '#2c8aa7',
				opacity: '0.3'
			};
		},
		polyEvents: {
			click: function (gPoly, eventName, polyModel) {
				window.alert('Poly Clicked: id:' + polyModel.$id + ' ' + JSON.stringify(polyModel.path));
			}
		},
		draw: undefined
	};
	console.log(features);
	$scope.map.polys = features;

	$scope.options = {
		scrollwheel: false
	};

	$scope.mapInfo = {};

	$scope.showInfo = function (obj) {
		$scope.mapInfo = obj;
	};

}]);