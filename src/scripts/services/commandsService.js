(function() {
	'use strict';

	angular
		.module('app')
		.service('commands',['parser','options',
			function(parser,options) {

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

				function suggest(search) {
					
					if (!search || search === '') {
	   					return '';
					}

	   				var pos = search.lastIndexOf(' ');
	   				pos = pos === -1 ? 0 : (pos + 1);

	   				var lastPart = search.substring(pos);

					if (lastPart !== '' && options.session.startsWith(lastPart)) {
						return search.substring(0,pos) + options.session;
					} else if (lastPart !== '' && options.settings.startsWith(lastPart)) {
						return search.substring(0,pos) + options.settings;
					} else if (lastPart !== '' && options.edit.startsWith(lastPart)) {
						return search.substring(0,pos) + options.edit;
					} else if (lastPart !== '' && options.priv.startsWith(lastPart)) {
						return search.substring(0,pos) + options.priv;
					} else if (lastPart !== '' && options.help.startsWith(lastPart)) {
						return search.substring(0,pos) + options.help;
					} else if (lastPart !== '' && options.add.startsWith(lastPart)) {
						return search.substring(0,pos) + options.add;
					} else if (lastPart !== '' && options.queryString.startsWith(lastPart)) {
						return search.substring(0,pos) + options.queryString;
					} else {
						return '';
					}
				};
			}
		]);
})();