'use strict';
angular.module('navigatorMaps').

filter('unsafe', [
	'$sce',
	function (a) {
		return function (val) {
			return a.trustAsHtml(val.replace(/(width|height)="(\d+|\d+%)"/ig, 'class="img-responsive"'));
		};
	}
]).

/**
 * [example]
 * <p>text | capitalize</p>
 * @return {TEXT} [return TEXT CAPITALIZE]
 */
filter('capitalize', function () {
	return function (v) {
		v = (v === null ? '' : String(v));
		return v.charAt(0).toUpperCase() + v.slice(1);
	};
}).

/**
 * [example]
 * <img ng-src='url | avatar' alt=''/>
 * @return {url} [return url avatar]
 */
filter('avatar', function () {
	return function (a) {
		if (!a) {
			a = 'img/avatar.jpg';
		}
		return a;
	};
});