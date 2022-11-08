'use strict';
angular.module('navigatorMaps').

/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/
provider('RouteHelpers', [
	'APP_REQUIRES',
	function (appRequires) {

		// Set here the base of the relative path
		// for all app views
		this.basepath = function (uri) {
			return '/views/' + uri;
		};

		// Generates a resolve object by passing script names
		// previously configured in constant.APP_REQUIRES
		this.resolveFor = function () {
			var _args = arguments;
			return {
				deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {

					// creates promise to chain dynamically
					function andThen(_arg) {
						// also support a function that returns a promise
						if (typeof _arg === 'function') {
							return promise.then(_arg);
						} else {
							return promise.then(function () {
								// if is a module, pass the name. If not, pass the array
								var whatToLoad = getRequired(_arg);
								// simple error check
								if (!whatToLoad) {
									return $.error('Route resolve: Bad resource name [' + _arg + ']');
								}
								// finally, return a promise
								return $ocLL.load(whatToLoad);
							});
						}
					}

					// check and returns required data
					// analyze module items with the form [name: '', files: []]
					// and also simple array of script files (for not angular js)
					function getRequired(name) {
						if (appRequires.modules) {
							for (var m in appRequires.modules) {
								if (appRequires.modules[m].name && appRequires.modules[m].name === name) {
									return appRequires.modules[m];
								}
							}
						}
						return appRequires.scripts && appRequires.scripts[name];
					}

					// Creates a promise chain for each argument
					var promise = $q.when(1); // empty promise
					for (var i = 0, len = _args.length; i < len; i++) {
						promise = andThen(_args[i]);
					}
					return promise;

				}]
			};
		}; // resolveFor

		// not necessary, only used in config block for routes
		this.$get = function () {};

	}
]).


/**=========================================================
 * Module: app-service.js
 * appService
 * require angular-cookie
 =========================================================*/

factory('appService', ['cookieService', 'storageService', function (cookieService, storageService) {
	if (typeof (Storage) !== 'undefined') {
		return storageService;
		// Code for localStorage/sessionStorage.
	} else {
		// Sorry! No Web Storage support..
		return cookieService;
	}
}]).


factory('sessionService', function () {
	var exports;
	exports = {
		get: function (key) {
			var record;
			record = JSON.parse(sessionStorage.getItem(key));
			if (!record) {
				return false;
			}
			return new Date().getTime() < record.timestamp && JSON.parse(record.value);
		},
		set: function (key, val, time) {
			var expire, record;
			if (time === null) {
				time = 864000;
			}
			expire = time * 60 * 1000;
			record = {
				value: JSON.stringify(val),
				timestamp: new Date().getTime() + expire
			};
			sessionStorage.setItem(key, JSON.stringify(record));
			return val;
		},
		unset: function (key) {
			return sessionStorage.removeItem(key);
		}
	};
	return exports;
}).


factory('storageService', function () {
	var exports;
	exports = {
		get: function (key) {
			var val;
			val = localStorage.getItem(key);
			if (!val) {
				return false;
			}
			return JSON.parse(val);
		},
		set: function (key, val) {
			localStorage.setItem(key, JSON.stringify(val));
			return val;
		},
		unset: function (key) {
			return localStorage.removeItem(key);
		},
		remove: function (key) {
			return localStorage.removeItem(key);
		}
	};
	return exports;
}).

factory('cookieService', ['$cookieStore', function ($cookieStore) {
	var exports;
	exports = {
		get: function (key) {
			var val;
			val = $cookieStore.get(key);
			if (!val) {
				return false;
			}
			return JSON.parse(val);
		},
		set: function (key, val) {
			$cookieStore.put(key, JSON.stringify(val));
			return val;
		},
		unset: function (key) {
			return $cookieStore.remove(key);
		},
		remove: function (key) {
			return $cookieStore.remove(key);
		}
	};
	return exports;
}]);