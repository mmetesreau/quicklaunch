(function() {
	'use strict';

	var optionStartKey 		= ':',
		optionSettings 		= ':settings',
		optionSession 		= ':all',
		optionEdit 			= ':edit',
		optionPriv 			= ':priv',
		optionHelp 			= ':help',
		optionAdd 			= ':add',
		optionQueryString 	= ':qs=';

	angular
		.module('app')
		.service('commands',['parser', 
			function(parser) {
				return {
					parse: parse
				};

				function parse(text) {

					if (!text)
						return undefined;

					var commandParts = parser.run(text);

					var tags = commandParts.filter(function(part) { return !part.startsWith(optionStartKey); });
					var options = commandParts.filter(function(part) { return part.startsWith(optionStartKey); });

					var command = {
						tags: tags,
						options: options.reduce(function(pv,option) { 
							pv.session = pv.session || option === optionSession;
							pv.incognito = pv.incognito || option === optionPriv;
							pv.add = pv.add || option === optionAdd;
							pv.edit = pv.edit || option === optionEdit;
							pv.settings = pv.settings || option === optionSettings;
							pv.help = pv.help || option === optionHelp;

							if (option.startsWith(optionQueryString)) {
								var qs = option.substring(optionQueryString.length);
								if (qs.length)
									pv.qs = qs;
							}
		
							return pv;
						},{})
					};

					command.noSuggestion = command.options.add || command.options.settings || command.options.help;

					return command;
				};
			}
		]);
})();