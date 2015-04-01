window.SC = function(selector){
	return angular.element(selector).scope();
};

(function() {
	'use strict';

	angular
		.module('main', [
			'ui.router',
			'ngSanitize',
			'angularFileUpload',

			'utils',
			'services',
			'directivesForm',
			'common.filters',
			'main.directives',

			'main.pages',
			'main.home',
			'main.auth',

			'main.profile',
			'main.quotes'
		])

		.config(configure)

		.run(runBlock)
	;

	//BACKEND_CFG  : array of backend configuration - CSRF_TOKEN, files cfg etc.

	configure.$inject = ['$httpProvider', '$locationProvider', '$urlRouterProvider', 'RestangularProvider'];
	function configure($httpProvider, $locationProvider, $urlRouterProvider, RestangularProvider)
	{
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		$httpProvider.defaults.useXDomain = true;

		$httpProvider.defaults.headers.common['X-Csrf-Token'] = BACKEND_CFG.CSRF_TOKEN;

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$urlRouterProvider.otherwise("/");

		RestangularProvider.setBaseUrl('/api');

		RestangularProvider.setDefaultHttpFields({cache: true});

		$httpProvider.interceptors.push('authInterceptor');
	}

	runBlock.$inject = ['$rootScope', '$window', '$location', 'anchorSmoothScroll', '$state', 'AuthService', 'carDBService'];
	function runBlock($rootScope, $window, $location, anchorSmoothScroll, $state, AuthService, carDBService) {
		// Init user session
		AuthService.create(function(res){
			$rootScope.AUTH = res;
		});

		$rootScope.gotoElement = function (eID){
			// call $anchorScroll()
			anchorSmoothScroll.scrollTo(eID);
		};

		//Loader
		$rootScope.$on('$stateChangeStart', function (event, next, current) {
			Loader.start();
		});
		$rootScope.$on('$stateChangeSuccess', function (event, next, current) {
			Loader.stop();
			$(window).scrollTop(0);
		});
		$rootScope.$on('$stateChangeError', function (event, next, current) {
			Loader.stop();
		});

		// Check is homepage (for footer)
		$rootScope.isHomePage = ($location.path() == '/') ? true : false;
		$rootScope.isLoginPage = ($location.path() == '/auth/login') ? true : false;
		$rootScope.isContactPage = ($location.path() == '/contact') ? true : false;
		$rootScope.isHowPage = ($location.path() == '/how-it-works') ? true : false;

		$rootScope.$on('$viewContentLoaded', function(){
			$rootScope.isHomePage = ($location.path() == '/') ? true : false;
			$rootScope.isLoginPage = ($location.path() == '/auth/login') ? true : false;
			$rootScope.isContactPage = ($location.path() == '/contact') ? true : false;
			$rootScope.isHowPage = ($location.path() == '/how-it-works') ? true : false;
		});

//		$rootScope.$on('$stateChangeSuccess', function(){
//			$('body').animate({scrollTop:0},800);
//		});

		// Load main data
		carDBService.getData().then(function(res){

			$window.DBSTYLES = res;
			_.map($window.DBSTYLES, function(x){
				if(x.evox) {
					var string = x.evox.split(':');
					x.image = 'https://d2yvqewjuuy0k6.cloudfront.net/evox/color_320_032_png/'+string[0]+'/'+string[0]+'_cc320_032_'+string[1]+'.png';
				} else {
					x.image = '/images/nophoto.png';
				}
				x.search = x.mk+' '+x.md+' '+x.nm;
			});
		});

		$rootScope.isNav = false;

		$rootScope.showAside=function(){
			if($rootScope.isNav){
				$rootScope.isNav = false;
			}
			else{
				$rootScope.isNav = true;
			}
		};

	}

})();
