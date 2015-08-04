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
					 template: '<div ng-repeat="tag in tags" class="label label-warning indent-left" ng-class="{\'pull-right\':pullRight}">{{tag}}</div>'
				};
			}
	]);
})();