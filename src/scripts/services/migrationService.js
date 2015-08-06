(function() {
	'use strict';

	angular
		.module('app')
		.service('migration',['parser',
			function(parser) {
				
				return {
					run : run,
					migrate: migrate,
					isAOldSuggestion: isAOldSuggestion
				};

				function run(suggestions) {

					var result = [];

					if (!suggestions || suggestions.constructor !== Array) {
						return result;
					}

					suggestions.forEach(suggestion => {
						if (!suggestion.tags) {
							suggestion.tags = [];
						}

						if (isAOldSuggestion(suggestion)) {
							result.push(migrate(suggestion));
						} else {
							result.push(suggestion);
						}
					});

					return result;
				};

				function migrate(oldSuggestion) {

					return {
						uri: oldSuggestion.uri,
						tags: parser.run(oldSuggestion.tags)
					};
				};

				function isAOldSuggestion(suggestion) {

					return suggestion !== null && typeof suggestion === 'object' && suggestion.uri && (typeof suggestion.uri === 'string' || suggestion.uri instanceof String) && suggestion.tags && (typeof suggestion.tags === 'string' || suggestion.tags instanceof String);
				};
			}
		]);
})();