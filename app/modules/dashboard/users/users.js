(function() {
	'use strict';

	angular.module('dashboard.users', [])
		.config(configure)

		.controller('DashboardUsersCtrl', DashboardUsersCtrl)
		.controller('DashboardUsersCtrl.edit', DashboardUsersCtrl_edit)
		.controller('DashboardUsersCtrl.changePassword', DashboardUsersCtrl_changePassword)
		//.factory('UsersResource', ['Restangular', function(Restangular) {
		//
		//	return Restangular.all('users');
		//}])
	;


	configure.$inject = ['$stateProvider'];
	function configure($stateProvider)
	{
		$stateProvider.state('users', {
			url: '/dashboard/users',
			abstract : true,
			template: '<ui-view></ui-view>'
		});

		$stateProvider.state('users.list', {
			url: '',
			controller: 'DashboardUsersCtrl',
			templateUrl: '/app/modules/dashboard/users/list.html',
			resolve: {
				Items : function(HttpService) {
					return HttpService.get('/api/users');
				}
			}
		});

		$stateProvider.state('users.create', {
			url: '/create',
			controller: 'DashboardUsersCtrl.edit',
			templateUrl: '/app/modules/dashboard/users/create.html',
			resolve: {
				Data : function(HttpService) {
					return HttpService.get('/api/users/create');
				}
			}
		});

		$stateProvider.state('users.edit', {
			url: '/:id/edit',
			controller: 'DashboardUsersCtrl.edit',
			templateUrl: '/app/modules/dashboard/users/edit.html',
			resolve: {
				Data : function(HttpService, $stateParams) {
					return HttpService.get('/api/users/' + $stateParams.id + '/edit');
				}
			}
		});

		$stateProvider.state('users.changePassword', {
			url: '/changePassword/:id',
			controller: 'DashboardUsersCtrl.changePassword',
			templateUrl: '/app/modules/dashboard/users/change-password.html'
		});


	}

	DashboardUsersCtrl.$inject = ['$scope', '$state', 'Items', 'HttpService'];
	function DashboardUsersCtrl($scope, $state, Items, HttpService) {
		$scope.items = Items.data.users;

		$scope.removeItem = function(item) {
			HttpService.delete('/api/users/' + item.id)
				.success(function () {
					$state.go($state.current, {}, {reload: true});
				});
		}
	}

	DashboardUsersCtrl_edit.$inject = ['$scope', '$state', 'HttpService', 'formErrors', 'Data'];
	function DashboardUsersCtrl_edit($scope, $state, HttpService, formErrors, Data) {

		$scope.item = Data.data.user !== undefined ? Data.data.user : {};
		$scope.forms = {};
		$scope.roles = Data.data.roles;

		$scope.saveItem = function() {
			if($scope.item.id === undefined) { //create
				HttpService.post('/api/users' ,$scope.item)
					.success(function(resp){
						$state.go('users.list');
					})
					.error(function(err){ //validation or other error
						formErrors.handle($scope.forms.edit, [err]);
					});
			} else {
				//update
				HttpService.put('/api/users/' + $scope.item.id, $scope.item )
					.success(function(resp){
						$state.go('users.list');
					})
					.error(function(err){ //validation or other error
						formErrors.handle($scope.forms.edit, [err]);
					});
			}
		};
	}

	DashboardUsersCtrl_changePassword.$inject = ['$scope', '$state', 'HttpService', '$stateParams', 'formErrors'];
	function DashboardUsersCtrl_changePassword($scope, $state, HttpService, $stateParams, formErrors) {
		$scope.item = {};

		$scope.changePassword = function() {
			HttpService.post('/api/users/changePassword/' + $stateParams.id, $scope.item)
				.success(function(resp){
					$state.go('users.list');
				})
				.error(function(err){ //validation or other error
					formErrors.handle($scope.forms.changePass, [err]);
				});
		}
	}

})();



