(function() {
	'use strict';
	
	var app = angular.module('app');

	app.controller('optionsCtrl',['$scope','$location','quicklaunch',function($scope,$location, quicklaunch) {
		quicklaunch.suggestions.load();
		
		$scope.ql = quicklaunch;

		var q = $location.search().q;

		if (q)
			$scope.q = q;
		
		$scope.clearInput = function(input) {
			input.uri = ''; 
			input.tags = ''; 
		};
	}]);
})();