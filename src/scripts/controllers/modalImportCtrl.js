(function() {
	'use strict';

	angular
		.module('app')
		.controller('modalImportCtrl',['$scope','$modalInstance','quicklaunch','browser',
			function($scope,$modalInstance,quicklaunch,browser) {

				$scope.text = '';
				$scope.browser = browser;

				$scope.import = function(text) {
					$modalInstance.close();
					quicklaunch.suggestions.importAll(text)
				};

				$scope.cancel = function() {
					$modalInstance.dismiss();
				};
			}
		]);
})();