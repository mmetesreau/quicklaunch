(function() {
	'use strict';

	angular
		.module('app')
		.constant('pages',{
			optionsDefault: 'options.html',
			optionsHelp: 	'options.html#?tab=help',
			optionsSearch: 	'options.html#?q='
		});
})();