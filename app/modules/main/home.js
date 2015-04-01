(function() {
	'use strict';

	angular.module('main.home', [])
		//.config(configure)
		.controller('SampleCtrl', SampleCtrl)
	;

	SampleCtrl.$inject = ['$rootScope', '$scope'];
	function SampleCtrl($rootScope, $scope)
	{
		//smth to do
	}
})();



