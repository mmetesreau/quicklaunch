(function() {
	'use strict';
	
	var storageKey = 'suggestions-v2';

	angular
		.module('app')
		.service('suggestions',['$timeout','browser','lodash',
			function($timeout, browser, lodash) {

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
						var data = { uri: newSuggestion.uri, tags: newSuggestion.tags || [] };

						suggestions.push(data);
						
						save();

						browser.notify('The suggestion has been added');
					}
				};

				function remove(suggestion) {
					var index = -1;
					
					for(var i = 0; i < suggestions.length; i++) {
						if (suggestions[i].uri === suggestion.uri && suggestions[i].tags === suggestion.tags) {
							index = i;
							break;
						}
					}

					if (index !== -1) {
						suggestions.splice(index, 1);
						save();
					}
				};

				function exportAll() {

					return JSON.stringify(suggestions.map(suggestion => { return { uri: suggestion.uri, tags: suggestion.tags }}),null,"    ");
				};

				function importAll(text) {

					if (!text)
						return;

					var parsedSuggestions = JSON.parse(text);

					if (!parsedSuggestions || parsedSuggestions.constructor !== Array)
						return;

					parsedSuggestions.forEach(function(parsedSuggestion) {
						if (parsedSuggestion !== null && typeof parsedSuggestion === 'object' && parsedSuggestion.uri)
							if (!suggestions.some(suggestion => suggestion.uri === parsedSuggestion.uri)) 
								suggestions.push(parsedSuggestion);
						});

					save();
				};
			}
		]);
})();