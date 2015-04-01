(function() {
	'use strict';

	angular
		.module('services', [])

		.service('FilesService', FilesService)
		.factory('authInterceptor', authInterceptor)
		.factory('Session', Session)
		.factory('AuthService', AuthService)
		.service('ProfileService', ProfileService)
		.service('HttpService', HttpService)
	;

	/* Fn
	 ============================================================================================================= */

	/* Fn
	 ============================================================================================================= */
	authInterceptor.$inject = ['$injector', '$q'];
	function authInterceptor($injector, $q) {
		return {
			response : function(response) {
				// If success $http Output debug, hide loader, etc
				// ...
				return response;
			},
			responseError: function(response) {
				// Intercept 401s & 403s
				// (typeof response.data !== string) - check if template
				//if(typeof response.data !== string && response.status === 401 || response.status === 403) {
				//	$injector.get('$state').transitionTo('auth_login');
				//	return $q.reject(response);
				//}
				//else {
					return $q.reject(response);
				//}
			}
		};
	}

	FilesService.$inject = ['$http'];
	function FilesService($http) {
		return {
			config:
				BACKEND_CFG.files
			,
			get: function(id) {
				if(id) {
					return $http.get('/api/files/'+id+'/');
				} else {
					return $http.get('/api/files/');
				}
			},
			post: function(model) {
				return $http.post('/api/files/', model);
			},
			put: function(model) {
				return $http.put('/api/files/'+model.id+'/', model);
			},
			deleteAll: function(data) {
				return $http.delete('/api/files/', {data: data});
			},
			src: function(type, token, size, ext) {
				var ext = ext || false;

				if(typeof token !== 'undefined' && token) {
					return '/' + this.config.assets_dir + '/'
						+ this.config.dir[type] + '/' + 'images' + '/'
						+ token[0] + '/' + token[1] + '/' + token[2] + '/' + token + '/'
						+ size + '.' + (ext ? ext : this.config.sizes[type][size].format);
				} else {
					if(this.config.rules[type].type == '1') {
						return '/images/stubs/'+ this.config.dir[type] +'/' + size + '.png';
					}
				}
			},
			decache : function() {

			}
		};
	}

	function Session() {
		this.create = function (user) {
			this.isAdmin = user.role_id == 2 || false;
			this.user = user;
		};
		this.destroy = function (scope) {
			this.isAdmin = null;
			this.user = null;
			scope = null;
		};
		return this;
	}

	AuthService.$inject = ['Session', '$http', 'ProfileService'];
	function AuthService(Session, $http, ProfileService) {
		this.login = function(params, form, formErrorCb, errorCb) {
			return $http.post('/auth/login', params)
				.success(function(data){

					if(data.success === true) {
						Session.create(data.item);

						if(typeof data.redirect !== 'undefined') {
							window.location.href = data.redirect;
						}
					} else {
						return errorCb(data.message);
					}



					return data.item;
				})
				.error(function(err) {
					return formErrorCb(err);
				});
		};
		this.create = function(callback) {
			ProfileService.get(cb);

			function cb(res){
				if(res.item === false) {
					return callback(null);
				}

				Session.create(res.item);

				var user = {
					email: res.item.email,
					fullname: res.item.name,
					isAdmin: res.item.role_id == 2 || false
				};

				return callback(user);
			}
		};
		this.register = function(user, errorCallback) {

			return $http.post('/auth/register', user)
				.success(function(resp) {
					window.location.href = resp.redirect;
				})
				.error(function(err) {
					return errorCallback(err);
				});
		};
//		this.isAuth = function () {
//			return !!Session.user;
//		};
		this.isAdmin = function(){
			return !!Session.isAdmin;
		};

		return this;
	}


	ProfileService.$inject = ['$http'];
	function ProfileService($http) {
		var url = '/api/auth/profile';

		return {
			get: function(callback) {
				return $http.get(url, false)
					.success(callback);
			},
			//update: function (data, callback) {
			//	return $http.put(url, {user: data}, callback);
			//},
			//updatePassword: function (data, callback) {
			//	return $http.put(url+'password/', {user: data}, callback);
			//}
		};
	}

	HttpService.$inject = ['$http', '$location'];
	function HttpService($http, $location) {
		return {
			get: getFn,
			post: postFn,
			put: putFn,
			delete: deleteFn
		};

		/* --- Functions --- */
		function successCallback(resp, callback) {
			if(callback) {
				return callback(resp);
			} else {
				return resp;
			}
		}

		function getFn(url, callback) {
			//var config = {};
			//if(search) {
			//	config.params = search;
			//}

			return $http.get(url)
				.success(function (resp) {
					//successCallback(resp, callback);
				});
		}

		function postFn(url, data, callback) {
			return $http.post(url, data)
				.success(function (resp) {
					successCallback(resp, callback);
				});
		}

		function putFn(url, data, callback) {
			return $http.put(url, data)
				.success(function (resp) {

					//// Update facebook
					//if(resp['ng:update_facebook']) {
					//	updateFacebookFn(resp['ng:update_facebook']);
					//}

					successCallback(resp, callback);
				});
		}

		function deleteFn(url, callback) {
			//var config = {};
			//if(search) {
			//	config.params = search;
			//}

			return $http.delete(url)
				.success(function (resp) {
					successCallback(resp, callback);
				});
		}
	}
})();
