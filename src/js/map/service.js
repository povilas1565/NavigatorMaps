'use strict';
angular.module('navigatorMaps').

factory('MapService', [
	'$http', 'API',
	function ($http, API) {
		var exports;
		exports = {
			'default': {
				id: ''
			},
			query: function () {
				return $http.get(API.apiUrl + 'maps');
			},
			create: function (params) {
				return $http.post(API.apiUrl + 'maps', params);
			},
			get: function (id) {
				return $http.get(API.apiUrl + 'maps/' + id, {
					headers: {
						'Accept': 'application/vnd.geo+json'
					}
				});
			},
			update: function (id, params) {
				return $http.put(API.apiUrl + 'maps/' + id, params);
			}
		};
		return exports;
	}
]);
