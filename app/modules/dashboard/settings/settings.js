(function() {
	'use strict';

	angular.module('dashboard.settings', [])
		.config(configure)

		.controller('DashboardSettingsCtrl', DashboardSettingsCtrl)
		.controller('DashboardSettingsCtrl.edit', DashboardSettingsCtrl_edit)
		.factory('DashboardSettingsResource', ['Restangular', function(Restangular) {

			//todo use HttpService
			return Restangular.all('settings');
		}])

	;


	configure.$inject = ['$stateProvider'];
	function configure($stateProvider)
	{

		$stateProvider.state('settings', {
			url: '/dashboard/settings',
			abstract : true,
			template: '<ui-view></ui-view>'
		});

		$stateProvider.state('settings.list', {
			url: '',
			controller: 'DashboardSettingsCtrl',
			templateUrl: '/app/modules/dashboard/settings/list.html',
			resolve: {
				Items : function(DashboardSettingsResource) {
					return DashboardSettingsResource.customGET('');
				}
			}
		});

		$stateProvider.state('settings.create', {
			url: '/create',
			controller: 'DashboardSettingsCtrl.edit',
			templateUrl: '/app/modules/dashboard/settings/create.html',
			resolve: {
				Item : function() {
					return null;
				}
			}
		});

		$stateProvider.state('settings.edit', {
			url: '/:id/edit',
			controller: 'DashboardSettingsCtrl.edit',
			templateUrl: '/app/modules/dashboard/settings/edit.html',
			resolve: {
				Item : function(DashboardSettingsResource, $stateParams) {
					return DashboardSettingsResource.get({ id : $stateParams.id}).$promise;
				}
			}
		});

		$stateProvider.state('settings.destroy', {
			url: '/:id',
			controller: 'DashboardSettingsCtrl.edit',
			resolve: {
				Item : function(DashboardSettingsResource, $stateParams) {
					return DashboardSettingsResource.remove({ id : $stateParams.id}).$promise;
				}
			}
		});


	}

	DashboardSettingsCtrl.$inject = ['$scope', 'Items', 'DashboardSettingsResource', '$state'];
	function DashboardSettingsCtrl($scope, Items, DashboardSettingsResource, $state) {
		$scope.items = Items.data;

		console.log($scope.items);

		$scope.removeItem = function(id) {
			DashboardSettingsResource.remove({ id : id}).$promise.then(function() {
				$state.go($state.current, {}, {reload: true});
			});
		}

		$scope.saveAllItems = function(items) {
			//DashboardSettingsResource.post('/updateAll', items);
			var data = [];

			angular.forEach(items, function(item, i) {
				//this.push(item.key + ': ' + item.value);
				data[item.key] = item.value;
			}, data);

			DashboardSettingsResource.customPOST({}, "updateAll", data, {})
		}

	}

	DashboardSettingsCtrl_edit.$inject = ['$scope', '$state', 'DashboardSettingsResource', 'formErrors', 'Item'];
	function DashboardSettingsCtrl_edit($scope, $state, DashboardSettingsResource, formErrors, Item) {

		$scope.item = Item ? Item.data : {}  ;
		$scope.forms = {};

		$scope.saveItem = function(item) {

			if($scope.item.id === undefined) { //create
				DashboardSettingsResource.save(item).$promise.then(function(resp){
					$state.go('settings.list');
				}).catch(function(err){ //validation or other error
					console.log($scope.forms.formAdd);

					formErrors.handle($scope.forms.formAdd, [err.data]);
					//$scope.validationErrors = err.data;
				});
			} else { //update
				DashboardSettingsResource.update(item).$promise.then(function(resp){
					$state.go('settings.list');
				}).catch(function(err){ //validation or other error
					console.log($scope.forms.formAdd);

					formErrors.handle($scope.forms.formAdd, [err.data]);
					//$scope.validationErrors = err.data;
				});
			}
		};
	}

})();



