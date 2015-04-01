(function() {
	'use strict';

	angular.module("dashboard")
		.directive('navBar', navbar)

	;

	function navbar() {
		var directive = {
			restrict: 'EA',
			controller: navbarCtrl,
			templateUrl: '/app/modules/dashboard/navbar/navbar.html',
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

		function navbarCtrl( $scope, $state ) {
			$scope.state = $state;
		}
	}
})();
