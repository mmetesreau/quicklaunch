(function() {
	'use strict';

	var app = angular.module('app');

	app.service('quicklaunch',['suggestions','$filter',function(suggestions,$filter) {
		var query = {};
		var filteredSuggestions = [];
		var selectedSuggestions = {index:0};
		var searchFilter = $filter('search');

		var parseCommand = function(command) {
			return {
				text: command,
				options : { incognito: false }
			};
		};

		var filterSuggestions = function(command) {
			query = parseCommand(command);
			filteredSuggestions = searchFilter(suggestions.all,query.text);

			if (selectedSuggestions.index >= filteredSuggestions.length)
				selectedSuggestions.index = 0;

			return filteredSuggestions;
		};

		var selectUp = function() {
			if (selectedSuggestions.index - 1 >= 0)
				selectedSuggestions.index = selectedSuggestions.index - 1;
		};

		var selectDown = function() {
			if (selectedSuggestions.index + 1 < filteredSuggestions.length)
				selectedSuggestions.index = selectedSuggestions.index + 1;
		};

		var valid = function() {
			validAt(selectedSuggestions.index);
		};

		var validAt = function(index) {
			var suggestion = filteredSuggestions[index];

			if (query.options.incognito)
				chrome.windows.create({"url": suggestion.uri, "incognito": suggestion.incognito});
			else 
				chrome.tabs.create({"url": suggestion.uri});
		};

		return {
			selectedSuggestions: selectedSuggestions,
			filterSuggestions: filterSuggestions,
			selectUp: selectUp,
			selectDown: selectDown,
			validAt: validAt,
			valid: valid,
			suggestions: suggestions
		};
	}]);
})();