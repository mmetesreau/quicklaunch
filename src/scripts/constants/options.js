(function() {
	'use strict';

	angular
		.module('app')
		.constant('options',{
			startKey: 		':',
			settings: 		':settings',
			session: 		':all',
			edit: 			':edit',
			priv: 			':priv',
			help: 			':help',
			add: 			':add',
			queryString: 	':qs='
		});
})();