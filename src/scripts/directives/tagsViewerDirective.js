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
					 replace: true,
					 template: '<div ng-repeat="tag in tags" class="label label-default indent-left" ng-class="{\'pull-right\':pullRight}">{{tag}}</div>'
				};
			}
	]);
})();