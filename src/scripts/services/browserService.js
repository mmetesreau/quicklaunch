(function() {
	'use strict';

	var notificationTemplate = { type: 'basic', title: 'Quicklaunch', message: '', iconUrl: '/icons/icon16.png'};

	angular
		.module('app')
		.service('browser',['$q','chrome',
			function($q,chrome) {
				
				return {
					notify: notify,
					translate: translate,
					openTab: openTab,
					openSessionTab: openSessionTab,
					getCurrentTab: getCurrentTab,
					setStorage: setStorage,
					getStorage: getStorage,
					getBookmarks: getBookmarks
				};

				function openTab(url, incognito) {

					if (incognito) {
						chrome.windows.create({ url: url, incognito: true });
					} else {
						chrome.tabs.create({ url: url });
					}
				};

				function openSessionTab(urls, incognito) {
					
					chrome.windows.create({ url: urls, incognito: incognito });
				};

				function getCurrentTab() {

					var deferred = $q.defer();

					chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
						deferred.resolve(tabs[0].url);
					});

					return deferred.promise;
				};

				function setStorage(data) {

					chrome.storage.local.set(data);
				};

				function getStorage(key) {

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

				function notify(message) {

					var notification = angular.copy(notificationTemplate);

					notification.message = message;

					chrome.notifications.create(notification);
				};

				function translate(key) {
					
					return chrome.i18n.getMessage(key);
				};

				function getBookmarks() {

					var deferred = $q.defer();

					chrome.bookmarks.getTree(function(bookmarkTreeNode) {
						if (bookmarkTreeNode) {
							deferred.resolve(bookmarkTreeNode);
						} else {
							deferred.resolve([]);
						}
					});

					return deferred.promise;
				};
			}
		]);
})();