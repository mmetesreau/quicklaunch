(function() {
	'use strict';

	var queryHelpTab = 'help';	

	angular
		.module('app')
		.controller('optionsCtrl',['$scope','$modal','$location','quicklaunch','browser',
			function($scope,$modal,$location,quicklaunch,browser) {
				
				quicklaunch.suggestions.load();
				
				$scope.ql = quicklaunch;
				$scope.browser = browser;

				var params = $location.search();

				if (params.q) {
					$scope.q = params.q;
				}

				if (params.tab && params.tab === queryHelpTab) {
					$scope.helpTabIsActive = true;
				} else {
					$scope.suggestionsTabIsActive = true;
				}

				$scope.newSuggestion = { uri: '', tags: [] };
				
				$scope.clearSuggestion = function(suggestion) {
					
					suggestion.uri = ''; 
					suggestion.tags = []; 
				};

				$scope.exportSuggestions = function() {
					$modal.open({
						animation: true,
						size: 'lg',
						template:'<div class="modal-body"><div class="form-group"><textarea class="form-control medium-height" ng-readonly="true" >{{text}}</textarea></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="ok()">{{translations.ok}}</button></div>',
						controller: ['$scope','$modalInstance','quicklaunch','browser',
							function($scope,$modalInstance,quicklaunch,browser) {
							
								$scope.text = quicklaunch.suggestions.exportAll();
								$scope.translations = {
									ok: browser.translate('helpExportOkButton')
								};

								$scope.ok = function() {
									$modalInstance.close();
								};
							}
						]
					});
				};

				$scope.importSuggestions = function() {
					$modal.open({
						animation: true,
						size: 'lg',
						template:'<div class="modal-body"><div class="form-group"><textarea class="form-control medium-height" placeholder="{{translations.placeholder}}" ng-model="text" ng-readonly="false" ></textarea></div></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">{{translations.cancel}}</button><button type="button" class="btn btn-primary" ng-click="ok(text)">{{translations.ok}}</button></div>',
						controller: ['$scope','$modalInstance','quicklaunch','browser',
							function($scope,$modalInstance,quicklaunch,browser) {
								
								$scope.text = '';
								$scope.translations = {
									ok: browser.translate('helpImportOkButton'),
									cancel: browser.translate('helpImportCancelButton'),
									placeholder: browser.translate('helpImportTextPlaceholder')
								};

								$scope.ok = function(text) {
									$modalInstance.close();
									quicklaunch.suggestions.importAll(text)
								};

								$scope.cancel = function() {
									$modalInstance.dismiss();
								};
							}
						]
					});
				};

				$scope.importBookmarks = function() {
					$modal.open({
						animation: true,
						size: 'lg',
						resolve: {
							bookmarks: ['quicklaunch',function(quicklaunch) {
								return quicklaunch.getBookmarks()
							}]
						},
						template:'<div class="modal-body"><div class="list-group"><div ng-repeat="bookmark in bookmarks" class="list-group-item"><div class="row"><div class="col-xs-6">{{bookmark.uri}}</div><div class="col-xs-5"><tags-viewer tags="bookmark.tags" pull-right="false"></div><div class="col-xs-1"><button class="btn btn-primary" ng-click="add(bookmark)">{{translations.add}}</button></div></div></div><div class="no-items text-center"><b>{{translations.noBookmark}}</b></div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="ok()">{{translations.ok}}</button></div>',
						controller: ['$scope','$modalInstance','quicklaunch','browser','bookmarks',
							function($scope,$modalInstance,quicklaunch,browser,bookmarks) {
								
								$scope.bookmarks = bookmarks;
								$scope.translations = {
									ok: browser.translate('helpImportBookmarksOkButton'),
									add: browser.translate('helpImportBookmarksAddButton'),
									noBookmark: browser.translate('helpImportNoBookmark')
								};

								$scope.ok = function() {
									$modalInstance.close();
								};

								$scope.add = function(bookmark) {
									quicklaunch.suggestions.add(bookmark);
					
									bookmarks.splice(bookmarks.indexOf(bookmark), 1);
								};
							}
						]
					});
				};
		}
	]);
})();