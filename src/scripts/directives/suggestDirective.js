(function() {
	'use strict';
	
	angular
		.module('app')
		.directive('suggest',[
			function() {
				return {
					 restrict: 'AE',
					 transclude: true,
					 scope: {
					 	entry: '=',
					 	getSuggest: '&'
					 },
					 templateUrl: 'suggest.tpl',
					 link: function (scope, element) {
					 	scope.suggestValue = '';

					 	var input = element.find('input');
					 	var placeholder = element.find('.suggest-placeholder');

					 	placeholder.css('height',input.css('input'));
					 	placeholder.css('width',input.css('width'));
					 	placeholder.css('padding',input.css('padding'));
					 	placeholder.css('top',input.css('borderTopWidth'));
					 	placeholder.css('left',input.css('borderLeftWidth'));
					 	placeholder.css('margin',input.css('margin'));
					 	placeholder.css('fontFamily',input.css('fontFamily'));
					 	placeholder.css('fontSize',input.css('fontSize'));
					 	placeholder.css('fontStyle',input.css('fontStyle'));
					 	placeholder.css('lineHeight',input.css('lineHeight'));
					 	placeholder.css('fontStyle',input.css('fontStyle'));
					 	placeholder.css('fontWeight',input.css('fontWeight'));
					 	placeholder.css('letterSpacing',input.css('letterSpacing'));
					 	placeholder.css('backgroundColor',input.css('backgroundColor'));

				 		input.addClass('.suggest-input');

				 		input.on('keydown', function(e) {

				 				var code = (e.keyCode ? e.keyCode : e.which);

				 				if (code == 9 && !e.altKey) {
									e.preventDefault();
								}
				 			})
				 			.on('keyup', function(e) {

				 				var code = (e.keyCode ? e.keyCode : e.which);

				 				var needle = scope.entry;

				 				if (scope.entry.length > 0) {
					 				if (code == 9 && scope.suggestValue.length > 0) {
					 					e.preventDefault();

					 					scope.entry = scope.suggestValue;

					 					scope.suggestValue = '';
					 				} else {
				 						scope.suggestValue = scope.getSuggest({value: scope.entry});
					 				}
				 				} else {
					 				scope.suggestValue = '';
				 				}

				 				scope.$apply();
				 			});

				 		input.focus();
					 }
				};
			}
	]);
})();