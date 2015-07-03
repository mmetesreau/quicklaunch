(function() {
	'use strict';

	var app = angular.module('app');

	app.service('quicklaunch',['suggestions','$filter',function(suggestions,$filter) {
		var query = {};
		var filteredSuggestions = [];
		var selectedSuggestions = {index:0};
		var searchFilter = $filter('search');

		var filterSuggestions = function(command) {
			query = parseCommand(command);

			if (query.options.add || query.options.settings || query.options.help || query.options.tag) 
				return [];

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
			if (query.options.add) {
				var tags = query.text;
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
					suggestions.add({ uri: tabs[0].url, tags: tags });
				});
			} else if (query.options.settings) {
				chrome.tabs.create({ url: "options.html" });
			}  else if (query.options.help) {
				chrome.tabs.create({ url: "options.html#?tab=help" });
			} else if (query.options.tag) {
				chrome.tabs.create({ url: "options.html#?tab=tags" });
			} else if (query.options.edit && (!query.text || query.text === '')) {
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
					chrome.tabs.create({ url: "options.html#?q=" + tabs[0].url });
				});
			} else if (query.options.edit && selectedSuggestions.index < filteredSuggestions.length) {
				chrome.tabs.create({ url: "options.html#?q=" + filteredSuggestions[selectedSuggestions.index].uri });
			}
			else if (selectedSuggestions.index < filteredSuggestions.length)
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