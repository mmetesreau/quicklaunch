<div>
	<div>
		<input class="form-control" type="text" ng-model="search" placeholder="{{placeholder}}" autofocus/>
	</div>
	<span class="tag label label-yellow indent-right" ng-repeat="tag in tags track by tag">
		{{tag}}<span class="indent-left" ng-click="remove($index)">x</span>
	</span>
</div>
