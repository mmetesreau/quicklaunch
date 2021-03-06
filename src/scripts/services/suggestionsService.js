(function() {
	'use strict';
	
	var storageKey = 'suggestions',
	syncStorageKey = 'suggestions';

	angular
		.module('app')
		.service('suggestions',['$timeout','browser','storageTypes','ternarySearchTree',
			function($timeout,browser,storageTypes,ternarySearchTree) {

				var suggestions = [];
				var storageType = storageTypes.local;

				return {
					all: suggestions,
					load: load,
					save: save,
					add: add,
					remove: remove,
					exportAll: exportAll,
					importAll: importAll,
					storageType: getSetstorageType,
					storageTypes: storageTypes,
					suggest: suggest
				};

				function suggest(lastPart) {

	   				var tst = ternarySearchTree.ternarySearchTree();

	   				suggestions.forEach(suggestion => {
	   					if (suggestion.tags)
	   						tst.addRange(suggestion.tags);
	   				});

	   				var searchResult = tst.prefixSearch(lastPart);

	   				if (!searchResult || searchResult.length == 0) {
	   					return '';
	   				} else {
	   					return searchResult[0];
	   				}
				};

				function getSetstorageType(newValue) {

					if (angular.isDefined(newValue)) {
						storageType = newValue;
						save();
						browser.notify(browser.translate(storageType === storageTypes.local ? 'confirmLocalStorage' : 'confirmSyncStorage'));
					}

					return storageType;
				};

				function load() {

					browser.getSyncStorage(syncStorageKey).then(syncData => {
						if (!syncData.storageType || syncData.storageType === storageTypes.local) {
							browser.getStorage(storageKey).then(data => {
								$timeout(() => {
									data.forEach(suggestion => suggestions.push(suggestion));
								});
							});
						} else {
							storageType = syncData.storageType;
							$timeout(() => {
								syncData[storageKey].forEach(suggestion => suggestions.push(suggestion));
							});
						}
					});
				};

				function save() {

					var syncData = {}, data = {};

					data[storageKey] = suggestions || [];
					syncData[syncStorageKey] = {
						storageType: storageType
					};

					if (storageType === storageTypes.local) {
						browser.setStorage(data);
					} else {
						browser.removeStorage(storageKey);
						syncData[syncStorageKey][storageKey] = suggestions || [];
					}

					browser.setSyncStorage(syncData);
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