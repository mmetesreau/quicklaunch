(function() {
	'use strict';
	
	angular
		.module('app')
		.directive('tagsEditor',[
			function() {
				return {
					 restrict: 'AE',
					 scope: {
					 	tags: '=',
					 	placeholder: '@'
					 },
					 replace: true,
					 templateUrl: 'tagsEditor.tpl',
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