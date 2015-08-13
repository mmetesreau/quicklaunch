(function() {
	'use strict';

	var limit = 10,
		trigger = 3;

	angular
		.module('app')
		.service('quicklaunch',['suggestions','commands','browser','pages',
			function(suggestions,commands,browser,pages) {

				var query = '';
				var suggestQuery = '';
				var command = {};
				var filteredSuggestions = [];
				var selectedSuggestions = { index: 0 };

				return {
					selectedSuggestions: selectedSuggestions,
					filterSuggestions: filterSuggestions,
					selectUp: selectUp,
					selectDown: selectDown,
					validAt: validAt,
					valid: valid,
					suggestions: suggestions,
					query: query,
					getSuggest: getSuggest,
					getBookmarks: getBookmarks
				};
	   			
				function getSuggest(search) {

					if (!search || search === '') {
	   					return '';
					}

	   				var pos = search.lastIndexOf(' ');
	   				pos = pos === -1 ? 0 : (pos + 1);

	   				var lastPart = search.substring(pos);

	   				if (lastPart === '') {
	   					return '';
	   				}

	   				var result =  commands.suggest(lastPart);

	   				if (result === '') {
	   					result = suggestions.suggest(lastPart);
	   				} 

	   				return result === '' ? '' : search.substring(0,pos) + result;
				};

				function getBookmarks() {
					
					return browser.getBookmarks().then(bookmarkTreeNode => {
						if(!bookmarkTreeNode) {
							return [];
						}

						var bookmarks = [];

						var parser = function(node, path) {

							path = path.slice();

							if (node.title) {
								var normalizedTitle = node.title.toLowerCase().trim();
								if (path.indexOf(normalizedTitle) === -1) {
									path.push(normalizedTitle);
								}
							}

							if (node.children) {
								node.children.forEach(child => parser(child,path));
							} else if(node.url) {
								var exist = suggestions.all.some(suggestion => suggestion.uri === node.url);
								if (!exist) {
									bookmarks.push({uri: node.url, tags: path});
								}
							}
  						};

						bookmarkTreeNode.forEach(node => parser(node,[]));
						return bookmarks;
					});
				};

				function filterSuggestions(search) {

					command = commands.parse(search);

					if (!command || command.noSuggestion || command.tags.length === 0 || command.tags.join('').length < trigger) {
						return [];
					}

					filteredSuggestions = suggestions.all.filter(suggestion => {
						return command.tags.every(commandTag => {
							return suggestion.tags.some(tag => tag.indexOf(commandTag) !== -1);
						});
					}).slice(0,limit);

					if (selectedSuggestions.index >= filteredSuggestions.length) {
						selectedSuggestions.index = 0;
					}

					return filteredSuggestions;
				};

				function selectUp() {

					if (selectedSuggestions.index - 1 >= 0) {
						selectedSuggestions.index = selectedSuggestions.index - 1;
					}
				};

				function selectDown() {

					if (selectedSuggestions.index + 1 < filteredSuggestions.length) {
						selectedSuggestions.index = selectedSuggestions.index + 1;
					}
				};

				function valid() {
					
					var tags = command.tags;

					if (command.options.add) {	
						browser.getCurrentTab().then(url => suggestions.add({ uri: url, tags: tags }, true));
					} else if (command.options.session && filteredSuggestions.length > 0) {
						browser.openSessionTab(filteredSuggestions.map(fs => fs.uri),command.options.incognito);
					} else if (command.options.settings) {
						browser.openTab(pages.optionsDefault); 
					} else if (command.options.help)  {
						browser.openTab(pages.optionsHelp);
					} else if (command.options.edit && command.tags.length === 0) {
						browser.getCurrentTab().then(url => browser.openTab(pages.optionsSearch + url));
					} else if (command.options.edit && selectedSuggestions.index < filteredSuggestions.length) {
						browser.openTab(pages.optionsSearch + filteredSuggestions[selectedSuggestions.index].uri);
					} else if (selectedSuggestions.index < filteredSuggestions.length){
						validAt(selectedSuggestions.index);
					} else {
						browser.notify(browser.translate('errorUnknow'));
					}
				};

				function validAt(index) {

					var suggestion = filteredSuggestions[index];
					var uri = suggestion.uri;

					if (command.options.qs) {
						uri += command.options.qs;
					}
					
					browser.openTab(uri,command.options.incognito);
				};		
			}
		]);
})();