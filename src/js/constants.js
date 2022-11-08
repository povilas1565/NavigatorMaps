'use strict';
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

angular.module('navigatorMaps').

constant('APP_REQUIRES', {
	// jQuery based and standalone scripts
	scripts: {
		fastclick: ['//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.3/fastclick.min.js'],
		modernizr: ['//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js'],
		animate: ['//cdnjs.cloudflare.com/ajax/libs/animate.css/3.2.0/animate.min.css'],
		sparklines: ['//cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js'],
		slimscroll: ['//cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.3/jquery.slimscroll.min.js'],
		screenfull: ['//cdnjs.cloudflare.com/ajax/libs/screenfull.js/2.0.0/screenfull.min.js'],
		parsley: ['//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.7/parsley.min.js']
	}
});