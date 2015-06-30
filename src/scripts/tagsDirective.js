(function() {
	'use strict';
	
	var app = angular.module('app');

	app.directive('tags',function() {
		return {
			 restrict: 'EA',
			 scope: {
			 	source: '='
			 },
			 template: '<div ng-repeat="tag in tags" class="label label-default indent-left">{{tag}}</div>',
			 controller: ['$scope',function($scope) {
			 	if ($scope.source) {
			 		$scope.tags = $scope.source.split(' ');
			 	}
			 }]
		};
	});
})();