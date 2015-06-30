(function() {
	'use strict';
	
	var app = angular.module('app');

	app.controller('mainCtrl',['$scope','quicklaunch',function($scope, quicklaunch) {
		quicklaunch.suggestions.load();

		$scope.ql = quicklaunch;

		$scope.keyup = function(event) {
			switch(event)
			{
				case 13: 
					quicklaunch.valid();
					$scope.command = '';
					break;
				case 40: 
					quicklaunch.selectDown();
					break;
				case 38: quicklaunch.selectUp();
					break;
				default:break;
			}
		};
	}]);
})();