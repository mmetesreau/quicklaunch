(function() {
	'use strict';
	
	angular
		.module('app')
		.directive('tagsEditor',[
			function() {
				return {
					 restrict: 'AE',
					 scope: {
					 	tags: '='
					 },
					 replace: true,
					 template: '<div><div><input class="form-control" type="text" ng-model="search" placeholder="Enter a few letters and type space or enter to validate" autofocus/></div><span class="tag label label-warning indent-right" ng-repeat="tag in tags track by tag">{{tag}}<span class="indent-left" ng-click="remove($index)">x</span></span></div>',
					 controller: ['$scope','$element',
					 	function($scope,$element) {

					 		$scope.search = '';

						 	$scope.add = function(value) {
						 		if (!$scope.tags.some(function(tag) { return tag === value; })) {
						 			$scope.tags.push(value);
									$scope.search = '';
									$scope.$apply();
						 		}
							};

							$scope.remove = function(index) {
								$scope.tags.splice(index, 1);
							};

							$element
								.find('input')
								.on('keydown', function(e) {
									var keys = [8, 13, 32];

									if(keys.indexOf(e.which) !== -1) {
										if(e.which == 8){
											if($scope.search.length === 0 && $scope.tags.length){
												$scope.tags.pop();
												e.preventDefault();
											}
										}
										else if(e.which == 32 || e.which == 13) {
											if($scope.search.length) {
												$scope.add($scope.search.trim().toLowerCase());
												e.preventDefault();
											}
										}
										$scope.$apply();
									}
								});
					 	}]
				};
			}
	]);
})();