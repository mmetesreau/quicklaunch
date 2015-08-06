<div class="modal-body">
	<div class="list-group">
		<div ng-repeat="bookmark in bookmarks" class="list-group-item">
			<div class="row">
				<div class="col-xs-6">
					{{bookmark.uri}}
				</div>
				<div class="col-xs-5">
					<tags-viewer tags="bookmark.tags" pull-right="false"></tags-viewer>
				</div>
				<div class="col-xs-1">
					<button class="btn btn-primary" ng-click="add(bookmark)">
						<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</button>
				</div>
			</div>
		</div>
		<div class="no-items text-center">
			<b>{{browser.translate('helpImportNoBookmark')}}</b>
		</div>
	</div>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-default" ng-click="close()">{{browser.translate('helpImportBookmarksCloseButton')}}</button>
	<button type="button" class="btn btn-primary" ng-click="addAll()">{{browser.translate('helpImportBookmarksAddAllButton')}}</button>
</div>
