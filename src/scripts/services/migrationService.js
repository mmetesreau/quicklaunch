(function() {
	'use strict';

	angular
		.module('app')
		.service('migration',['parser',
			function(parser) {
				
				return {
					run : run
				};

				function run(suggestions) {
					if (!suggestions || suggestions.constructor !== Array)
						return [];

					suggestions.forEach(suggestion => {
						if (!suggestion.tags)
							suggestion.tags = [];

						if (typeof suggestion === 'string' || suggestion instanceof String)
							suggestion.tags = parser.run(suggestion.tags);
					});

					return suggestions;
				};
			}
		]);
})();