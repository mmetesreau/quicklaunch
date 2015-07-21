(function() {
	'use strict';

	var app = angular.module('app');

	app.service('quicklaunch',['suggestions','commands','browser','$filter',function(suggestions,commands,browser,$filter) {
		var query = {};
		var filteredSuggestions = [];
		var selectedSuggestions = { index: 0 };
		var searchFilter = $filter('search');

		var filterSuggestions = function(command) {
			query = commands.parse(command);

			if (query && query.options && commands.hasActionOptions(query.options)) 
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
			var tags = query.text;

			if (query.options.add) 
				browser
					.getCurrentTab()
					.then(function(url) { 
						suggestions.add({ uri: url, tags: tags });
						browser.notif('The suggestion has been added'); 
					});
			else if (query.options.settings) 
				browser.openTab("options.html");
			else if (query.options.help) 
				browser.openTab("options.html#?tab=help");
			else if (query.options.edit && (!tags || tags === '')) 
				browser
					.getCurrentTab()
					.then(function(url) { browser.openTab("options.html#?q=" + url); });
			else if (query.options.edit && selectedSuggestions.index < filteredSuggestions.length) 
				browser.openTab("options.html#?q=" + filteredSuggestions[selectedSuggestions.index].uri);
			else if (selectedSuggestions.index < filteredSuggestions.length)
				validAt(selectedSuggestions.index);
		};

		var validAt = function(index) {
			var suggestion = filteredSuggestions[index];
			var uri = suggestion.uri;

			if (query.options.qs)
				uri += query.options.qs;
			
			if (query.options.incognito)
				browser.openPrivateTab(uri);
			else 
				browser.openTab(uri);
		};

		var identity = function(suggestion) {
			return suggestion.uri + "::" + suggestion.tags;
		};

		return {
			selectedSuggestions: selectedSuggestions,
			filterSuggestions: filterSuggestions,
			selectUp: selectUp,
			selectDown: selectDown,
			validAt: validAt,
			valid: valid,
			suggestions: suggestions,
			identity: identity
		};
	}]);
})();