(function() {
	'use strict';
	
	var keyEnter = 13,
		keyDown = 40,
		keyUp = 38;

	angular
		.module('app')
		.controller('mainCtrl',['$scope','quicklaunch','browser',
			function($scope,quicklaunch,browser) {
				quicklaunch.suggestions.load();

				$scope.ql = quicklaunch;
				$scope.browser = browser;
				
				$scope.keyup = function(event) {
					switch(event)
					{
						case keyEnter: 
							quicklaunch.valid();
							$scope.command = '';
							break;
						case keyDown: 
							quicklaunch.selectDown();
							break;
						case keyUp: 
							quicklaunch.selectUp();
							break;
						default:
							break;
					}
				};
		}
	]);
})();