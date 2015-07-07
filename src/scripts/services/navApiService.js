(function() {
	'use strict';

	var app = angular.module('app');

	app.service('navApi',['$q',function($q) {
		var openTab = function(url) {
			chrome.tabs.create({ url: url });
		};

		var openPrivateTab = function(url) {
			chrome.windows.create({ url: url, incognito: true });
		};

		var getCurrentTab = function() {
			var deferred = $q.defer();

			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
				deferred.resolve(tabs[0].url);
			});

			return deferred.promise;
		};

		var setStorage = function(data) {
			chrome.storage.local.set(data);
		};

		var getStorage = function(key) {
			var deferred = $q.defer();

			chrome.storage.local.get(function(storage) {
				if (storage && storage[key]) {
					deferred.resolve(storage[key]);
				} else {
					deferred.resolve([]);
				}
			});

			return deferred.promise;
		};

		var notif = function(message) {
			chrome.notifications.create({ type: 'basic', title: 'Quick launch', message: message, iconUrl: '/icons/icon16.png'});
		};

		return {
			notif: notif,
			openTab: openTab,
			openPrivateTab: openPrivateTab,
			getCurrentTab: getCurrentTab,
			setStorage: setStorage,
			getStorage: getStorage 
		};
	}]);

})();