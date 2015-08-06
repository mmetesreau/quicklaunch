(function() {
	'use strict';

	var queryHelpTab = 'help';	

	angular
		.module('app')
		.controller('optionsCtrl',['$scope','$modal','$location','quicklaunch','browser',
			function($scope,$modal,$location,quicklaunch,browser) {
				
				quicklaunch.suggestions.load();
				
				$scope.ql = quicklaunch;
				$scope.browser = browser;

				var params = $location.search();

				if (params.q) {
					$scope.q = params.q;
				}

				if (params.tab && params.tab === queryHelpTab) {
					$scope.helpTabIsActive = true;
				} else {
					$scope.suggestionsTabIsActive = true;
				}

				$scope.newSuggestion = { uri: '', tags: [] };
				
				$scope.clearSuggestion = function(suggestion) {
					
					suggestion.uri = ''; 
					suggestion.tags = []; 
				};

				$scope.exportSuggestions = function() {
					$modal.open({
						size: 'lg',
						templateUrl: 'modalExport.tpl',
						controller: 'modalExportCtrl'
					});
				};

				$scope.importSuggestions = function() {
					$modal.open({
						size: 'lg',
						templateUrl: 'modalImport.tpl',
						controller: 'modalImportCtrl'
					});
				};

				$scope.importBookmarks = function() {
					$modal.open({
						size: 'lg',
						resolve: {
							bookmarks: ['quicklaunch',function(quicklaunch) {
								return quicklaunch.getBookmarks()
							}]
						},
						windowClass: 'scroll-modal',
						templateUrl: 'modalBookmarks.tpl',
						controller: 'modalBookmarksCtrl'
					});
				};
		}
	]);
})();