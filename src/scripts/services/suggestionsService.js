(function() {
	'use strict';
	
	var storageKey = 'suggestions';

	angular
		.module('app')
		.service('suggestions',['$timeout','browser','migration',
			function($timeout,browser,migration) {

				var suggestions = [];

				return {
					all: suggestions,
					load: load,
					save: save,
					add: add,
					remove: remove,
					exportAll: exportAll,
					importAll: importAll
				};

				function load() {

					browser.getStorage(storageKey).then((data) => {
						data = migration.run(data);
						$timeout(() => {
							data.forEach(suggestion => suggestions.push(suggestion));
						});
					});
				};

				function save() {

					var data = {};

					data[storageKey] = suggestions || [];

					browser.setStorage(data);
				};

				function add(newSuggestion) {

					var exist = suggestions.some(suggestion => suggestion.uri === newSuggestion.uri);
					
					if (exist) {
						browser.notify('The suggestion was already added');
					} else {
						suggestions.push({ uri: newSuggestion.uri, tags: newSuggestion.tags || [] });
						
						save();

						browser.notify('The suggestion has been added');
					}
				};

				function remove(suggestion) {

					var index = suggestions.indexOf(suggestion);
					
					if (index !== -1) {
						suggestions.splice(index, 1);
						save();
					}
				};

				function exportAll() {

					return JSON.stringify(suggestions.map(suggestion => { 
						return { 
							uri: suggestion.uri, 
							tags: suggestion.tags 
						};
					}),null,"    ");
				};

				function importAll(text) {

					if (!text)
						return;

					var parsedSuggestions = JSON.parse(text);

					if (!parsedSuggestions || parsedSuggestions.constructor !== Array)
						return;

					var isASuggestion = suggestion => parsedSuggestion !== null && typeof parsedSuggestion === 'object' && parsedSuggestion.uri && (typeof parsedSuggestion.uri === 'string' || parsedSuggestion.uri instanceof String) && parsedSuggestion.tags && parsedSuggestion.tags.constructor === Array;
					
					parsedSuggestions.forEach(function(parsedSuggestion) {
						if (isASuggestion(parsedSuggestion)) {
							if (!suggestions.some(suggestion => suggestion.uri === parsedSuggestion.uri)) {
								suggestions.push(parsedSuggestion);
							} else {
								browser.notify('...');
							}
						} else {
							browser.notify('...');
						}
					});

					save();
				};
			}
		]);
})();