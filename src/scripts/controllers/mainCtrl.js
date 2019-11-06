(function() {
	'use strict';
	
	var keyEnter = 13,
		keyDown = 40,
		keyUp = 38;

	angular
		.module('app')
		.controller('mainCtrl',['$scope','$timeout','$window','quicklaunch','browser',
			function($scope,$timeout,window,quicklaunch,browser) {
				
				quicklaunch.suggestions.load();

				$scope.ql = quicklaunch;
				$scope.browser = browser;
				
				$scope.keyup = function(event) {
					
					switch(event)
					{
						case keyEnter: 
							quicklaunch.valid();
							quicklaunch.query = '';
							$timeout(() => window.close(), 250);
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