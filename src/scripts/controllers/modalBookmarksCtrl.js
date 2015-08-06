(function() {
	'use strict';

	angular
		.module('app')
		.controller('modalBookmarksCtrl',['$scope','$modalInstance','quicklaunch','browser','bookmarks',
			function($scope,$modalInstance,quicklaunch,browser,bookmarks) {

				$scope.bookmarks = bookmarks;
				$scope.browser = browser;

				$scope.close = function() {
					$modalInstance.close();
				};

				$scope.addAll = function() {
					$modalInstance.close();

					bookmarks.forEach(bookmark => {
						quicklaunch.suggestions.add(bookmark);
					});
				};

				$scope.add = function(bookmark) {
					quicklaunch.suggestions.add(bookmark);
	
					bookmarks.splice(bookmarks.indexOf(bookmark), 1);
				};
			}
		]);
})();