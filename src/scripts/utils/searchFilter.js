(function() {
	'use strict';
	
	angular
		.module('app')
		.filter('search',[
			function() {
				var trigger = 3;

				return function(suggestions,tags) {
					if (!tags || tags.trim().length < trigger)
						return [];

					var allTags = tags.trim().split(' ');

					return suggestions
							.filter(function(suggestion) { 
								return allTags.every(function(tag) {
									return suggestion.tags && suggestion.tags.toLowerCase().indexOf(tag) !== -1;
								});
							});
				};
		}
	]);
})();