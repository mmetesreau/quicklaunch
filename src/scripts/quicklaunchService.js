(function() {
	'use strict';

	var app = angular.module('app');

	app.service('quicklaunch',['suggestions','$filter',function(suggestions,$filter) {
		var query = {};
		var filteredSuggestions = [];
		var selectedSuggestions = {index:0};
		var searchFilter = $filter('search');

		var parseCommand = function(command) {
			if (!command)
				return '';

			var commandParts = command.split(' ');

			var texts = commandParts.filter(function(part) { return !part.trim().startsWith(':'); });
			var options = commandParts.filter(function(part) { return part.trim().startsWith(':'); });

			return {
				text: texts.join(' '),
				options : options.reduce(function(pv,option) { 
					switch(option)
					{
						case ":priv" : 
							pv.incognito = true;
							break;
						case ":add" : 
							pv.add = true;
							break;
						case ":edit" : 
							pv.edit = true;
							break;
						case ":settings" : 
							pv.settings = true;
							break;
						default: break;
					}
					return pv;
				},{})
			};
		};

		var filterSuggestions = function(command) {
			query = parseCommand(command);

			if (query.options.add || query.options.settings) 
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
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
					suggestions.add({ uri: tabs[0].url, tags: query.text });
				});
			} else if (query.options.settings) {
				chrome.tabs.create({ url: "options.html" });
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