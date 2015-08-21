(function() {
	'use strict';

	angular
		.module('app')
		.filter('anytags',['commands',
			function(commands) {
				return function(items, query) {

					if (!query || query.length === 0)
						return items;

					var filtered = [];

					if (items && items.length > 0) {

						items.forEach((item) => {
							if (item.tags && item.tags.length > 0) {
								var queryParts = query.split(' ').map(queryPart => queryPart.trim().toLocaleLowerCase());

								if (queryParts.every(queryPart => item.tags.some(tag => tag.indexOf(queryPart) !== -1 ))) {
									filtered.push(item);
								}
							}
						});
					}

					return filtered;
				};
			}]);
	})();