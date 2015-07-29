(function() {
	'use strict';

	var helpTab = 'tabHelp',
		suggestionsTab = 'tabItems',
		queryHelpTab = 'help';	

	angular
		.module('app')
		.controller('optionsCtrl',['$scope','$location','quicklaunch','browser',
			function($scope,$location,quicklaunch,browser) {
				
				quicklaunch.suggestions.load();
				
				$scope.ql = quicklaunch;
				$scope.browser = browser;

				var params = $location.search();

				if (params.q) {
					$scope.q = params.q;
				}

				if (params.tab && params.tab === queryHelpTab) {
					$scope.currentTab = helpTab;
				} else {
					$scope.currentTab = suggestionsTab;
				}

				$scope.newSuggestion = { uri: '', tags: [] };
				
				$scope.clearSuggestion = function(suggestion) {
					
					suggestion.uri = ''; 
					suggestion.tags = []; 
				};
		}
	]);
})();