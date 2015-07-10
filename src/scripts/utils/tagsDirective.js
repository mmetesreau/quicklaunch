(function() {
	'use strict';
	
	angular
		.module('app')
		.directive('tags',function() {
			return {
				 restrict: 'EA',
				 scope: {
				 	source: '=',
				 	right: '='
				 },
				 template: '<div ng-repeat="tag in tags" class="label label-default indent-left" ng-class="{\'pull-right\':right}">{{tag}}</div>',
				 controller: ['$scope',function($scope) {
				 	if ($scope.source) {
				 		$scope.tags = $scope.source.split(' ');
				 	}
				 }]
			};
	});
})();