(function() {
	'use strict';

	angular.module('main.profile', [])
		.config(configure)
		.controller('ProfileCtrl.edit', ProfileCtrl_edit)

		.factory('ProfileResource', ['Restangular', function(Restangular) {
			return Restangular.all('auth/profile');
		}])
	;

	configure.$inject = ['$stateProvider'];
	function configure($stateProvider)
	{
		$stateProvider.state('profile_complete', {
			url: '/profile/complete',
			controller: 'ProfileCtrl.edit',
			templateUrl: '/app/modules/main/profile/complete.html',
			resolve: {
				Data : function(ProfileResource) {
					return ProfileResource.customGET('complete');
				}
			}
		});

		$stateProvider.state('profile_edit', {
			url: '/profile',
			controller: 'ProfileCtrl.edit',
			templateUrl: '/app/modules/main/profile/edit.html',
			resolve: {
				Data : function(ProfileResource) {
					return ProfileResource.customGET('edit');
				}
			}
		});
	}

	ProfileCtrl_edit.$inject = ['$scope', '$rootScope', '$state', 'Data', '$http'];
	function ProfileCtrl_edit ($scope, $rootScope, $state, Data, $http) {
		$scope.credit_scores = Data.credit_scores;
		$scope.incomes = Data.incomes;
		$scope.referrals = Data.referrals;
		$scope.states = Data.states;

		var item = Data.profile ? Data : {}  ;

		$scope.item = item;
		$scope.forms = {};
		$scope.editMode = true;

		if($scope.item.profile === undefined) {
			$scope.item.profile = {
				email : $rootScope.AUTH.email
			}
		} else {
			$scope.item.profile.email  = $rootScope.AUTH.email;
		}

		$scope.saveProfile = function() {
			var method = $scope.item.profile.id === undefined ? $http.post : $http.put;

			method('/api/auth/profile', $scope.item.profile).success(function(resp) {
				$state.go('page_request_quote');
			}).error(function(err) {
				$scope.formErrors = err;
			});
		};
	}
})();
