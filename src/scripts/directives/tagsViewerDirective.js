(function() {
	'use strict';
	
	angular
		.module('app')
		.directive('tagsViewer',[
			function() {
				return {
					 restrict: 'AE',
					 scope: {
					 	tags: '=',
					 	pullRight: '='
					 },
					 templateUrl: 'tagsViewer.tpl'
				};
			}
	]);
})();