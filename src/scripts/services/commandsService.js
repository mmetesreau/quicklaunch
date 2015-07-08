(function() {
	'use strict';

	var app = angular.module('app');

	app.service('commands',[function() {
		var hasActionOptions = function(options) {
			return options.add || options.settings || options.help;
		};

		var parse = function(command) {
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
						case ":help" : 
							pv.help = true;
							break;
						default: 
							if (option.startsWith(':qs=')) {
								var qs = option.split('=');
								if (qs.length > 1)
									pv.qs = qs[1].trim();
							}
						break;
					}
					return pv;
				},{})
			};
		};

		return {
			hasActionOptions: hasActionOptions,
			parse: parse
		};
	}]);

})();