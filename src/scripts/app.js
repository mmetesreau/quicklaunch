(function() {
	'use strict';

	var app = angular.module('app',[]);

	app.controller('mainCtrl',['$scope','$filter',function($scope,$filter) {
		$scope.items = [];

		chrome.storage.local.get(function(storage) {
			if (storage && storage.items)
			 	storage.items.forEach(function(item) {
			 		$scope.items.push(item);
			 	});
		});


		$scope.selectFirst = function(items, query) {
			if (items && $filter('search')(items,query).length > 0) {
				$scope.select($filter('search')(items,query)[0]);
			}
		};

		$scope.select = function(item) {
			$scope.query = '';
			if (item.incognito)
				chrome.windows.create({"url": item.uri, "incognito": item.incognito});
			else 
				chrome.tabs.create({"url": item.uri});

		};
	}]);

	app.controller('optionsCtrl',['$scope','$timeout',function($scope,$timeout) {
		$scope.items = [];
		$scope.parsedItemPushed = 0;
		$scope.currentTab = 'tabItems';

		chrome.storage.local.get(function(storage) {
			if (storage && storage.items)
				$timeout(function() {
				 	storage.items.forEach(function(item) {
				 		$scope.items.push(item);
				 	});
			 	});
		});

		$scope.add = function(newItem) {
			$scope.items.push({uri: newItem.uri, tags: newItem.tags});
			newItem.uri = ''; 
			newItem.tags = ''; 
		};

		$scope.delete = function(index) {
			$scope.items.splice(index, 1);
		};

		$scope.export = function(items) {
			$scope.exportResult = JSON.stringify(items.map(function(item) { return {uri: item.uri, tags: item.tags}; }),null,"    ");
		};

		$scope.import = function(text, items) {
			if (!text)
				return;

			var parsedItems = JSON.parse(text);

			if (parsedItems.constructor !== Array)
				return;

			var parsedItemPushed = 0;
			
			parsedItems.forEach(function(parsedItem) {
				if (parsedItem !== null && typeof parsedItem === 'object' && parsedItem.uri && !items.some(function(existingItem) { return parsedItem.uri === existingItem.uri; })) {
					items.push(parsedItem);
					parsedItemPushed++;
				}
			});

			$scope.parsedItemPushed = parsedItemPushed;
		};

		$scope.save = function(items) {
			chrome.storage.local.set({'items': $scope.items || []});
		};
	}]);

	app.filter('search',function() {
		return function(inputs, query) {
			var isIncognitoQuery = function(query) {
				return query.toLowerCase().startsWith('priv');
			};

			if (!query || query.trim().length < (isIncognitoQuery(query)? 8:5))
				return [];

			var subQueries = (isIncognitoQuery(query) ? query.substring(4) : query).trim().split(' ');

			return inputs
					.filter(function(input) { 
						return subQueries.every(function(subQuery) {
							return input.tags.toLowerCase().indexOf(subQuery) != -1;
						});
					})
					.map(function(input) {
						input.incognito = isIncognitoQuery(query);
						return input;
					});
		};
	});
})();