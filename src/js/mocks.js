'use strict';
angular.module('navigatorMapsE2E', ['navigatorMaps', 'ngMockE2E']).
run(function ($httpBackend) {
	$httpBackend.whenPOST().passThrough();
	$httpBackend.whenGET().passThrough();
	$httpBackend.whenPUT().passThrough();
	$httpBackend.whenPATCH().passThrough();
	$httpBackend.whenDELETE().passThrough();
	//...
});