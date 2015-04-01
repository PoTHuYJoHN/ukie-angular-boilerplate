(function() {
	'use strict';

	angular.module('main.auth', [])
		.config(configure)

		.controller('AuthCtrl.login', AuthCtrlLogin)
		.controller('AuthCtrl.register', AuthCtrlRegister)
		.run(runBlock)
	;
	runBlock.$inject = ['$rootScope'];
	function runBlock($rootScope) {

		$rootScope.isLoggedIn = function() {
			return !!$rootScope.AUTH;
		};
		$rootScope.isAdmin = function() {
			return $rootScope.AUTH &&  $rootScope.AUTH.isAdmin === true;
		}
	}

	configure.$inject = ['$stateProvider'];
	function configure($stateProvider)
	{
		$stateProvider.state('auth_login', {
			url: '/auth/login',
			controller: 'AuthCtrl.login',
			templateUrl: '/app/modules/main/auth/login.html'
		});

		$stateProvider.state('auth_register', {
			url: '/auth/register',
			controller: 'AuthCtrl.register',
			templateUrl: '/app/modules/main/auth/register.html'
		});
	}


	AuthCtrlLogin.$inject = ['$scope', 'AuthService'];
	function AuthCtrlLogin($scope, AuthService)
	{
		$scope.user = {};
		$scope.forms = {};
		$scope.formErrors = [];

		$scope.login = function(user) {
			$scope.formErrors = [];
			AuthService.login(user, $scope.forms.login, function(errors) {
				$scope.formErrors = errors;
			}, function(authMessage) {
				$scope.authMessage = authMessage;
			});
		}
	}

	AuthCtrlRegister.$inject = ['$scope', 'AuthService'];
	function AuthCtrlRegister($scope, AuthService)
	{
		$scope.user = {};
		$scope.forms = {};
		$scope.formErrors = [];

		$scope.register = function() {
			$scope.user.role_id = 1;
			$scope.formErrors = [];
			AuthService.register($scope.user, function(errors) {
				$scope.formErrors = errors;
			});
		}
	}
})();



