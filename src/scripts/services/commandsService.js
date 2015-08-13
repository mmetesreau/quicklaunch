(function() {
	'use strict';

	angular
		.module('app')
		.service('commands',['parser','options','ternarySearchTree',
			function(parser,options,ternarySearchTree) {

				return {
					parse: parse,
					suggest: suggest
				};

				function parse(text) {

					if (!text) {
						return undefined;
					}

					var commandParts = parser.run(text);

					var commandTags = commandParts.filter(part => !part.startsWith(options.startKey));
					var commandOptions = commandParts.filter(part => part.startsWith(options.startKey));

					var command = {
						tags: commandTags,
						options: commandOptions.reduce((pv,option) => { 

							pv.session 			= pv.session 	|| option === options.session;
							pv.incognito 		= pv.incognito 	|| option === options.priv;
							pv.add 				= pv.add 		|| option === options.add;
							pv.edit 			= pv.edit 		|| option === options.edit;
							pv.settings 		= pv.settings 	|| option === options.settings;
							pv.help 			= pv.help 		|| option === options.help;

							if (option.startsWith(options.queryString)) {
								var qs = option.substring(options.queryString.length);
								if (qs.length > 0) {
									pv.qs = qs;
								}
							}
		
							return pv;
						},{})
					};

					command.noSuggestion = command.options.add || command.options.settings || command.options.help;

					return command;
				};

				function suggest(lastPart) {

	   				var tst = ternarySearchTree.ternarySearchTree();

	   				tst.add(options.session);
	   				tst.add(options.settings);
	   				tst.add(options.edit);
	   				tst.add(options.priv);
	   				tst.add(options.help);
	   				tst.add(options.add);
	   				tst.add(options.queryString);

	   				var searchResult = tst.prefixSearch(lastPart);


	   				if (!searchResult || searchResult.length == 0) {
	   					return '';
	   				} else {
	   					return searchResult[0];
	   				}
				};
			}
		]);
})();