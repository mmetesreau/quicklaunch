(function() {
	'use strict';

	var app = angular.module('app');

	app.service('commands',['suggestions','$filter',function(suggestions,$filter) {

		var isCommand = function(command) {
			return command.add || command.settings || command.help || command.tag
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
						case ":tags" : 
							pv.tag = true;
							break;
						default: break;
					}
					return pv;
				},{})
			};
		};

		return {
			parse: parse
		};
	});

})();