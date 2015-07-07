(function() {
	'use strict';
	
	var app = angular.module('app');

	app.service('suggestions',['$timeout','navApi',function($timeout, navApi) {
		var suggestions = [];

		var fillSuggestions = function(data) {
			$timeout(function() {
				data.forEach(function(suggestion) {
					suggestions.push(suggestion);
				});
			});
		};

		var load = function() {
			navApi
			.getStorage('suggestions')
			.then(fillSuggestions);
		};

		var save = function() {
			var data = { 'suggestions': suggestions || [] };

			navApi
			.setStorage(data);
		};

		var suggestionContainUri = function(uri) {
			return function(suggestion) {
				return uri === suggestion.uri;
			};
		};

		var add = function(suggestion) {
			var exist = suggestions.some(suggestionContainUri(suggestion.uri));
			
			if (!exist) {
				var data = { uri: suggestion.uri, tags: suggestion.tags };

				suggestions.push(data);
				
				save();
			}
		};

		var remove = function(suggestion) {
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

		var mapSuggestion = function(suggestion) { 
			return { suggestion: suggestion.uri, tags: suggestion.tags }; 
		};

		var exportAll = function() {
			return JSON.stringify(suggestions.map(mapSuggestion),null,"    ");
		};

		var importAll = function(text) {
			if (!text)
				return;

			var parsedItems = JSON.parse(text);

			if (parsedItems.constructor !== Array)
				return;

			parsedItems.forEach(function(parsedItem) {
				if (parsedItem !== null && typeof parsedItem === 'object' && parsedItem.uri)
					if (!suggestions.some(suggestionContainUri(parsedItem.uri))) 
						suggestions.push(parsedItem);
				});

			save();
		};

		return {
			all: suggestions,
			load: load,
			save: save,
			add: add,
			remove: remove,
			exportAll: exportAll,
			importAll: importAll
		};
	}]);
})();