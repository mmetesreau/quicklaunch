(function() {
	'use strict';
	
	var app = angular.module('app');

	app.filter('search',function() {
		return function(suggestions, query) {
			if (!query || query.trim().length < 3)
				return [];

			var subQueries = query.trim().split(' ');

			return suggestions
					.filter(function(suggestion) { 
						return subQueries.every(function(subQuery) {
							return suggestion.tags.toLowerCase().indexOf(subQuery) !== -1;
						});
					});
		};
	});
})();