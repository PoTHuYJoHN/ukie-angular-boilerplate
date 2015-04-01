(function() {
	'use strict';

	angular.module('main.pages', [])
		.config(configure)

		.controller('PagesCtrl.home', PagesCtrlHome)
		.controller('PagesCtrl.request', PagesCtrlRequest)
		.controller('PagesCtrl.about', PagesCtrlAbout)
		.controller('PagesCtrl.what', PagesCtrlWhat)
		.controller('PagesCtrl.how', PagesCtrlHow)
		.controller('PagesCtrl.contact', PagesCtrlContact)
		.controller('PagesCtrl.faq', PagesCtrlFaq)
		.controller('PagesCtrl.terms', PagesCtrlTerms)

		.constant('accordionConfig', {
			closeOthers: true
		})

		.factory('PageResource', ['Restangular', function(Restangular) {
			return Restangular.all('common/pages');
		}])
	;

	configure.$inject = ['$stateProvider'];
	function configure($stateProvider)
	{
		$stateProvider.state('page_home', {
			url: '/',
			controller: 'PagesCtrl.home',
			templateUrl: '/app/modules/main/pages/home.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('home');
				}
			}
		});

		$stateProvider.state('page_about', {
			url: '/about',
			controller: 'PagesCtrl.about',
			templateUrl: '/app/modules/main/pages/about.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('about');
				}
			}
		});

		$stateProvider.state('page_request_quote', {
			url: '/request-quote',
			controller: 'PagesCtrl.request',
			templateUrl: '/app/modules/main/pages/request-quote.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('request-quote');
				}
			}
		});

		$stateProvider.state('page_what_we_do', {
			url: '/what-we-do',
			controller: 'PagesCtrl.what',
			templateUrl: '/app/modules/main/pages/what-we-do.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('what-we-do');
				}
			}
		});

		$stateProvider.state('page_how_it_works', {
			url: '/how-it-works',
			controller: 'PagesCtrl.how',
			templateUrl: '/app/modules/main/pages/how-it-works.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('how-it-works');
				}
			}
		});

		$stateProvider.state('page_contact', {
			url: '/contact',
			controller: 'PagesCtrl.contact',
			templateUrl: '/app/modules/main/pages/contact.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('contact');
				}
			}
		});

		$stateProvider.state('page_contact_success', {
			url: '/contact-success',
			templateUrl: '/app/modules/main/pages/contact-success.html'
		});

		$stateProvider.state('page_faq', {
			url: '/faq',
			controller: 'PagesCtrl.faq',
			templateUrl: '/app/modules/main/pages/faq.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('faq');
				}
			}
		});

		$stateProvider.state('page_terms', {
			url: '/terms',
			controller: 'PagesCtrl.terms',
			templateUrl: '/app/modules/main/pages/terms.html',
			resolve: {
				Data : function(PageResource) {
					return PageResource.customGET('terms');
				}
			}
		});
	}

	PagesCtrlHome.$inject = ['$rootScope', '$window', '$scope', '$location', 'Data', 'array_util', 'carDBService'];
	function PagesCtrlHome($rootScope, $window, $scope, $location, Data, array_util, carDBService)
	{
		$scope.testimonials = array_util.partition(Data.testimonials, 2);
		$scope.images = array_util.partition(Data.images, 3);

		setMetaInfo($rootScope, Data.page);


		// Define makers
		$scope.makers = [];

		// Load main data from service & split to chunks
		carDBService.getData().then(function(res){
			$scope.makers = array_util.chunk(_.uniq(_.clone($window.DBSTYLES), function(x){
				return x.mk;
			}), 0, 12);
		});

		// Change makers chunks
		$scope.activeMakerChunk = $location.search().brandpage ? parseInt($location.search().brandpage) : 0;
		$scope.changeMakerChunkProperty = function(index) {
			if(index < 0 && $scope.activeMakerChunk > 0) {
				$scope.activeMakerChunk--;

			}

			if(index > 0 && $scope.activeMakerChunk < $scope.makers.length - 1) {
				$scope.activeMakerChunk++;
			}

			// Change url parameters
			if($scope.activeMakerChunk>0) {
				$location.url('/?brandpage=' + $scope.activeMakerChunk);
			} else {
				$location.url('/');
			}

		}

		// Load cartypes/categories from service
		$scope.cartypes = carDBService.getCartypes();

		// TEMPLATE HELPERS
		$scope.searchType = $location.search().type ? 'type' : 'brand';
		$scope.switchSearchType = function(type){
			$scope.searchType = type;

			// Change url parameters
			if(type == 'type') {
				$location.url('/?type=' + type);
			} else {
				$location.url('/');
			}
		}
	}

	PagesCtrlRequest.$inject = ['$rootScope','$scope', 'Data'];
	function PagesCtrlRequest($rootScope, $scope, Data)
	{
		$scope.page = Data.page;
		setMetaInfo($rootScope, Data.page);
	}

	PagesCtrlAbout.$inject = ['$rootScope', '$scope', 'Data'];
	function PagesCtrlAbout($rootScope, $scope, Data)
	{
		$scope.page = Data.page;
		$scope.members = Data.members;
		setMetaInfo($rootScope, Data.page);
	}

	PagesCtrlWhat.$inject = ['$rootScope', '$scope', 'Data'];
	function PagesCtrlWhat($rootScope, $scope, Data)
	{
		$scope.page = Data.page;
		setMetaInfo($rootScope, Data.page);
	}

	PagesCtrlTerms.$inject = ['$rootScope', '$scope', 'Data'];
	function PagesCtrlTerms($rootScope, $scope, Data)
	{
		$scope.page = Data.page;
		setMetaInfo($rootScope, Data.page);
	}

	PagesCtrlHow.$inject = ['$rootScope', '$scope', 'Data'];
	function PagesCtrlHow($rootScope, $scope, Data)
	{
		$scope.page = Data.page;
		$scope.steps = Data.steps;
		setMetaInfo($rootScope, Data.page);
	}

	PagesCtrlFaq.$inject = ['$rootScope','$scope', 'Data'];
	function PagesCtrlFaq($rootScope, $scope, Data)
	{
		setMetaInfo($rootScope, Data.page);
		$scope.faqs = Data.faqs;

		$scope._= _;
		// Tab toggler
		$scope.activeTab = false;

		$scope.togglerTab = function(id){
			if(!$scope.activeTab || $scope.activeTab !== id) {
				$scope.activeTab = id;
			} else {
				$scope.activeTab = false;
			}
		};
	}

	PagesCtrlContact.$inject = ['$rootScope', '$scope', '$state', 'Data', 'PageResource'];
	function PagesCtrlContact($rootScope, $scope, $state, Data, PageResource)
	{
		$scope.page = Data.page;
		$scope.settings = Data.settings;
		setMetaInfo($rootScope, Data.page);

		$scope.forms = {};

		$scope.sendMessage = function(message) {

			PageResource.customPOST(message ,'contact').then(function(resp) {
				$state.go('page_contact_success');
			}).catch(function(err){ //validation or other error
				$scope.formErrors = err.data;
			});
		};
	}


	///**
	// * CloseOther items accordion
	// * @param $scope
	// */
	//function closeOthers (openGroup) {
	//	var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
	//	if ( closeOthers ) {
	//		angular.forEach(this.groups, function (group) {
	//			if ( group !== openGroup ) {
	//				group.isOpen = false;
	//			}
	//		});
	//	}
	//}

	/**
	 * Helper method to set seo values
	 * @param $rootScope
	 * @param page
	 */
	function setMetaInfo($rootScope, page) {
		$rootScope.seo_title = page.seo_title;
		$rootScope.seo_description = page.seo_description;
	}
})();



