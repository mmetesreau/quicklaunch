(function() {
	'use strict';
	
	var app = angular.module('app');

	app.controller('optionsCtrl',['$scope','quicklaunch',function($scope,quicklaunch) {
		quicklaunch.suggestions.load();
		
		$scope.ql = quicklaunch;

		$scope.clearInput = function(input) {
			input.uri = ''; 
			input.tags = ''; 
		};
	}]);
})();