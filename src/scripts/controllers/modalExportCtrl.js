(function() {
	'use strict';

	angular
		.module('app')
		.controller('modalExportCtrl',['$scope','$modalInstance','quicklaunch','browser',
			function($scope,$modalInstance,quicklaunch,browser) {

				$scope.text = quicklaunch.suggestions.exportAll();
				$scope.browser = browser;

				$scope.close = function() {
					$modalInstance.close();
				};
			}
		]);
})();