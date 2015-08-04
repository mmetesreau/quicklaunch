(function() {
	'use strict';

	var separator = ' ';
	
	angular
		.module('app')
		.service('parser',[
			function() {
				
				return {
					run : run
				};

				function run(str) {
					var entries = [];
					var entry = '';

					for (var i=0;i<str.length;i++) {
						var letter = str.charAt(i);

						if (letter === separator) {
							if (entry !== separator) {
								entries.push(entry);
							}

							entry = '';
						}
						else {
							entry += letter;
						}
					}

					if (entry !== '') {
						entries.push(entry);
					}

					return entries;
				};
			}
		]);
})();