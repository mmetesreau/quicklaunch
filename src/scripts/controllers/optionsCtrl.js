(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('optionsCtrl',['$scope','$location','quicklaunch',function($scope,$location,quicklaunch) {
			quicklaunch.suggestions.load();
			
			$scope.ql = quicklaunch;

			var q = $location.search().q;
			var tab = $location.search().tab;

			if (q)
				$scope.q = q;

			if (tab && tab === 'help')
				$scope.currentTab = 'tabHelp';
			else
				$scope.currentTab = 'tabItems';

			$scope.clearInput = function(input) {
				input.uri = ''; 
				input.tags = ''; 
			};
	}]);
})();