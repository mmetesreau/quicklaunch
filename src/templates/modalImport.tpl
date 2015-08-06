<div class="modal-body">
	<div class="form-group">
		<textarea class="form-control medium-height" placeholder="{{browser.translate('helpImportTextPlaceholder')}}" ng-model="text" ng-readonly="false" ></textarea>
	</div>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-default" ng-click="cancel()">{{browser.translate('helpImportCancelButton')}}</button>
	<button type="button" class="btn btn-primary" ng-click="import(text)">{{browser.translate('helpImportOkButton')}}</button>
</div>
