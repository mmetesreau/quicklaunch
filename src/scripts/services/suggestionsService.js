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

					browser.getStorage(storageKey).then(data => {
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

				function add(newSuggestion, showNotification) {

					var exist = suggestions.some(suggestion => suggestion.uri === newSuggestion.uri);
					
					if (exist) {
						if (showNotification) {
							browser.notify(browser.translate('errorSuggestionExist'));
						}
					} else {
						suggestions.push({ uri: newSuggestion.uri, tags: newSuggestion.tags || [] });
						
						save();
						
						if (showNotification) {
							browser.notify(browser.translate('confirmSuggestionAdded'));
						}
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

					if (!text) {
						browser.notify(browser.translate('errorUnknow'));
						return;
					}

					try {
						var parsedSuggestions = JSON.parse(text);

						if (!parsedSuggestions || parsedSuggestions.constructor !== Array) {
							return;
						}

						var isASuggestion = suggestion => suggestion !== null && typeof suggestion === 'object' && suggestion.uri && (typeof suggestion.uri === 'string' || suggestion.uri instanceof String) && suggestion.tags && suggestion.tags.constructor === Array;
						
						parsedSuggestions.forEach(parsedSuggestion => {

							if (migration.isAOldSuggestion(parsedSuggestion)) {
								parsedSuggestion = migration.migrate(parsedSuggestion);
							}

							if (isASuggestion(parsedSuggestion)) {
								if (!suggestions.some(suggestion => suggestion.uri === parsedSuggestion.uri)) {								
									suggestions.push(parsedSuggestion);
								} else {
									browser.notify(browser.translate('errorSuggestionExist'));
								}
							} else {
								browser.notify(browser.translate('errorSuggestionMisformatted'));
							}
						});

						save();
					} catch(e) {
						browser.notify(browser.translate('errorUnknow'));
					}
				};
			}
		]);
})();