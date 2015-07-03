(function() {
	'use strict';
	
	var app = angular.module('app');

	app.controller('optionsCtrl',['$scope','$location','quicklaunch',function($scope,$location, quicklaunch) {
		quicklaunch.suggestions.load();
		
		$scope.ql = quicklaunch;

		var q = $location.search().q;

		if (q)
			$scope.q = q;
		
		var tab = $location.search().tab;
		
		if (tab && tab === 'tags')
			$scope.currentTab = 'tabTags';
		else if (tab && tab === 'help')
			$scope.currentTab = 'tabHelp';
		else
			$scope.currentTab = 'tabItems';

		$scope.clearInput = function(input) {
			input.uri = ''; 
			input.tags = ''; 
		};
	}]);
})();