(function() {
	'use strict';
	
	var app = angular.module('app');

	app.filter('search',function() {
		var trigger = 3;

		return function(suggestions, query) {
			if (!query || query.trim().length < trigger)
				return [];

			var subQueries = query.trim().split(' ');

			return suggestions
					.filter(function(suggestion) { 
						return subQueries.every(function(subQuery) {
							return suggestion.tags && suggestion.tags.toLowerCase().indexOf(subQuery) !== -1;
						});
					});
		};
	});
})();