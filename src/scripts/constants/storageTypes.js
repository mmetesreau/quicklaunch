(function() {
	'use strict';

	angular
		.module('app')
		.constant('storageTypes',{
			local: 	'local',
			sync: 	'sync'
		});
})();