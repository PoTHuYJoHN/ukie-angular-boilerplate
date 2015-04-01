(function() {
	'use strict';

	angular.module("main.directives", [])
		.directive('scroll', scroll)
		.directive('mainNav', mainNav)
	;

	function mainNav() {
		var directive = {
			restrict: 'EA',
			controller: ['$scope','$state', '$rootScope', mainNavCtrl],
			templateUrl: '/app/modules/main/main-nav.html',
			compile: compileFunc,
			link: linkFunc
		};

		return directive;

		function compileFunc(tElement, tAttributes) {

			// Compile code goes here.
			return {
				pre: function preLink( scope, element, attributes, controller ) {
					// Pre-link code goes here
				},
				post: function postLink( scope, element, attributes, controller ) {
					// Post-link code goes here
					linkFunc();
				}
			};
		}

		function linkFunc(scope, element, attrs){}

		function mainNavCtrl( $scope, $state, $rootScope ) {
			$scope.state = $state;

			angular.element('.site-nav-item a').on('click', function() {
				$rootScope.isNav = false;
			});
		}
	}

	scroll.$inject = ['$window'];
	function scroll($window) {
		return function($scope) {
			angular.element($window).bind("scroll", function() {
				if (this.pageYOffset >= 680) {
					$scope.boolChangeClass = true;
				} else {
					$scope.boolChangeClass = false;
				}
				$scope.$apply();
			});
		};
	}
})();
