'use strict';
angular.module('navigatorMaps').

factory('FeatureService', [
	'$http', 'API',
	function ($http, API) {
		var exports;
		exports = {
			'default': {
				id: ''
			},
			query: function () {
				return $http.get(API.apiUrl + 'features');
			},
			create: function (params) {
				return $http.post(API.apiUrl + 'features', params);
			},
			get: function (id) {
				return $http.get(API.apiUrl + 'features/' + id);
			},
			update: function (id, params) {
				return $http.put(API.apiUrl + 'features/' + id, params);
			}
		};
		return exports;
	}
]);