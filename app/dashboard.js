(function() {
	'use strict';

	angular.module('dashboard', [
		'ui.router',
		'ngResource',
		'restangular',
		'angularFileUpload',
		'ngDialog',
		'services',
		'dashboard.directives',
		'directivesForm',
		'common.filters',

		'dashboard.settings',
		'dashboard.users'
	])

		.config(configure);

	//BACKEND_CFG  : array of backend configuration - CSRF_TOKEN, files cfg etc.

	configure.$inject = ['$httpProvider', '$locationProvider', '$urlRouterProvider'];
	function configure($httpProvider, $locationProvider, $urlRouterProvider)
	{

		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		$httpProvider.defaults.useXDomain = true;

		$httpProvider.defaults.headers.common['X-Csrf-Token'] = BACKEND_CFG.CSRF_TOKEN;

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$urlRouterProvider.otherwise("/dashboard");
	}
})();
