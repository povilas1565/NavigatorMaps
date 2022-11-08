'use strict';
angular.module('navigatorMaps').

controller('MapCtrl', ['$scope', 'Map', function ($scope, Map) {
	var
		i = 0,
		markerUrl = 'http://gmaps-samples.googlecode.com/svn/trunk/markers/',
		ret = [],
		features = Map.features || [];

	function marker (color, label) {
		return markerUrl + color + '/marker' + label + '.png';
	}

	function select (photo) {
		$scope.coords = {
			latitude: photo.latitude,
			longitude: photo.longitude
		};
		$scope.selected = photo;
		$scope.icon = marker('red', photo.id);
	}

	function scrollToListItem(id){
		var divList, itemHeight, y;
		divList = angular.element('.photos-list')[0];
		itemHeight = divList.scrollHeight/features.length;
		y = itemHeight * (id - 1) ;
		divList.scrollTop = y;
	}

	angular.forEach(features, function (item) {
		i++;
		this.push({
			id: i,
			longitude: item.geometry.coordinates[0],
			latitude: item.geometry.coordinates[1],
			title: item.properties.title,
			url: item.properties.photoUrl,
			icon: marker('green', i)
		});
	}, ret);

	$scope.maps = ret;

	$scope.events = {
		'click': function (markr, ev, model) {
			select(model);
			scrollToListItem(model.id);
		}
	};

	if (ret.length > 1) {
		$scope.map = {
			center: {
				latitude: ret[0].latitude,
				longitude: ret[0].longitude
			},
			zoom: 14
		};

		select(ret[0]);
	}

	$scope.opts = {
		zIndex: 10000000
	};

	$scope.options = {
		scrollwheel: false
	};

	$scope.mapInfo = {};

	$scope.showInfo = function (obj) {
		$scope.mapInfo = obj;
	};

	$scope.selectPhoto = function (photo){
		$scope.map.center = {
			latitude: photo.latitude,
			longitude: photo.longitude
		};

		select(photo);
	};
}]);
