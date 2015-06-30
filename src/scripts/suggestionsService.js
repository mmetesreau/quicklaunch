(function() {
	'use strict';
	
	var app = angular.module('app');

	app.service('suggestions',['$timeout',function($timeout) {
		var suggestions = [];

		var load = function() {
			chrome.storage.local.get(function(storage) {
				if (storage && storage.suggestions)
					$timeout(function() {
						storage.suggestions.forEach(function(suggestion) {
			 				suggestions.push(suggestion);
			 			});
					});
			 		
			});
		};

		var save = function() {
			chrome.storage.local.set({'suggestions': suggestions || []});
		};

		var add = function(newItem) {
			suggestions.push({uri: newItem.uri, tags: newItem.tags});
			save();
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

		var exportAll = function() {
			return JSON.stringify(suggestions.map(function(suggestion) { return {suggestion: suggestion.uri, tags: suggestion.tags}; }),null,"    ");
		};

		var importAll = function(text) {
			if (!text)
				return;

			var parsedItems = JSON.parse(text);

			if (parsedItems.constructor !== Array)
				return;

			parsedItems.forEach(function(parsedItem) {
				if (parsedItem !== null && typeof parsedItem === 'object' && parsedItem.uri)
					if (!suggestions.some(function(suggestion) { return parsedItem.uri === suggestion.uri; })) 
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