(function() {
	'use strict';

	var limit = 10,
		trigger = 3;

	angular
		.module('app')
		.service('quicklaunch',['suggestions','commands','browser',
			function(suggestions,commands,browser) {

				var query = '';
				var suggestQuery = '';
				var command = {};
				var filteredSuggestions = [];
				var selectedSuggestions = { index: 0 };

				var filter = function(suggestions,tags,limit,trigger) {
					if (tags.length === 0 || tags.join('').length < trigger)
						return [];

					return suggestions
							.filter(function(suggestion) { 
								return tags.every(function(tag) {
									return suggestion.tags.some(function(stag) { return stag.indexOf(tag) !== -1});
								});
							});
				};

				return {
					selectedSuggestions: selectedSuggestions,
					filterSuggestions: filterSuggestions,
					selectUp: selectUp,
					selectDown: selectDown,
					validAt: validAt,
					valid: valid,
					suggestions: suggestions,
					query: query,
					getSuggest: getSuggest
				};
	   			
	   			function getSuggest(search) {
	   				
	   				if (!search || search === '')
	   					return '';

	   				var pos = search.lastIndexOf(' ');
	   				pos = pos === -1 ? 0 : (pos + 1);

	   				var lastPart = search.substring(pos);

					if (lastPart !== '' && ':all'.startsWith(lastPart))
						return search.substring(0,pos) + ':all';
					else if (lastPart !== '' && ':settings'.startsWith(lastPart))
						return search.substring(0,pos) + ':settings';
					else if (lastPart !== '' && ':edit'.startsWith(lastPart))
						return search.substring(0,pos) + ':edit';
					else if (lastPart !== '' && ':priv'.startsWith(lastPart))
						return search.substring(0,pos) + ':priv';
					else if (lastPart !== '' && ':help'.startsWith(lastPart))
						return search.substring(0,pos) + ':help';
					else if (lastPart !== '' && ':add'.startsWith(lastPart))
						return search.substring(0,pos) + ':add';
					else if (lastPart !== '' && ':qs='.startsWith(lastPart))
						return search.substring(0,pos) + ':qs=';
					else
						return '';
	   			};

				function filterSuggestions(search) {

					command = commands.parse(search);

					if (!command || command.noSuggestion) 
						return [];

					filteredSuggestions = filter(suggestions.all,command.tags,limit,trigger);

					if (selectedSuggestions.index >= filteredSuggestions.length)
						selectedSuggestions.index = 0;

					return filteredSuggestions;
				};

				function selectUp() {
					if (selectedSuggestions.index - 1 >= 0)
						selectedSuggestions.index = selectedSuggestions.index - 1;
				};

				function selectDown() {
					if (selectedSuggestions.index + 1 < filteredSuggestions.length)
						selectedSuggestions.index = selectedSuggestions.index + 1;
				};

				function valid() {
					if (command.options.add) 
						browser.getCurrentTab().then(function(url) { suggestions.add({ uri: url, tags: command.tags }); });
					else if (command.options.session && filteredSuggestions.length > 0) 
						browser.openSessionTab(filteredSuggestions.map(function(s) { return s.uri; }),command.options.incognito);
					else if (command.options.settings) 
						browser.openTab("options.html");
					else if (command.options.help) 
						browser.openTab("options.html#?tab=help");
					else if (command.options.edit && command.tags.length === 0) 
						browser.getCurrentTab().then(function(url) { browser.openTab("options.html#?q=" + url); });
					else if (command.options.edit && selectedSuggestions.index < filteredSuggestions.length) 
						browser.openTab("options.html#?q=" + filteredSuggestions[selectedSuggestions.index].uri);
					else if (selectedSuggestions.index < filteredSuggestions.length)
						validAt(selectedSuggestions.index);
					else 
						browser.notify('Something wrong happend');
				};

				function validAt(index) {

					var suggestion = filteredSuggestions[index];
					var uri = suggestion.uri;

					if (command.options.qs)
						uri += command.options.qs;
					
					browser.openTab(uri,command.options.incognito);
				};		
			}
		]);
})();