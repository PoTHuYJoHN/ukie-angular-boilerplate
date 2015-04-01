(function() {
	'use strict';

	angular.module("directivesForm", [])

		.directive('customInput', customInput)
		.directive('customTextarea', customTextarea)
		.directive('customSelect', customSelect)
		.directive('customCheckbox', customCheckbox)
		.directive('customRadio', customRadio)
		//.directive('customCover', customCover)
		.directive('customGallery', customGallery)
		.directive('avatar', avatar)
		.directive('imgCropped', imgCropped)
		.directive('geocompleteInput', geocompleteInput)

		// Example directives
		//.directive('exampleDirective', exampleDirective)


		.directive('formGroup', function () {
			return {
				restrict: 'E',
				require: '^form',
				transclude: true,
				replace: true,
				scope: {
					cssClass: '@class',
					input: '=',
					ckeditor : '='
				},
				template: '<div class="form-group" ng-class="{\'has-error\':hasError, cssClass:true}">'+
				'<div ng-transclude></div>' +
				'<div ng-if="hasError">' +
				'<span ng-repeat="(key,error) in form[input].$error" class="help-block" '+
				'ng-if="error" ng-bind="key">' +
				'</span>' +
				'</div>' +
				'</div>',
				compile : function (element, attrs, ctrl) {

					return {
						post : function($scope, element, attrs, ctrl) {

							$scope.form = ctrl;
							$scope.input = attrs.input;
							var input = $scope.form.$name + '.' + $scope.input;


							$scope.$parent.$watch(input+'.$invalid', function (hasError) {
								$scope.hasError = hasError;
							});
						}
					}
				}
			};
		})
		.factory('formErrors', function () {

			return {
				/**
				 * Creates $error.errorKey (String) and sets validity
				 * for every failing model validation received from the server.
				 * E.g. 'form.message.$error.errorKey' can be accessed in the view.
				 * @param  {Object} form
				 * @param  {Object} errors, formatted like this: [{"subject":["required"],"text":["required"]}]}
				 */
				handle: function (form, errors) {

					if(angular.isUndefined(errors) || angular.isUndefined(form)) {return;}

					this.clean(form);

					angular.forEach(errors, function(error) {
						angular.forEach(error, function(errorKeys, inputName) {
							angular.forEach(errorKeys, function(errorKey) {
								form[inputName].$setValidity(errorKey, false);
								form[inputName].$setPristine();
							});
						});
					});

				},
				/**
				 * Cleans form errors by setting validity of every input to true
				 * @param  {Object} form
				 */
				clean: function(form) {
					if(angular.isUndefined(form)) {return;}

					angular.forEach(form, function(input) {
						if(!input) { return; }
						angular.forEach(input.$error, function(invalid, errorKey) {
							if(invalid) {
								input.$setValidity(errorKey, true);
							}
						});
					});
				}
			};

		});

	/* Fn
	 ============================================================================================================= */



	function customInput() {
		var directive = {
			restrict: 'AE',
			scope: {
				model: '=',
				//blur : '=',
				name: '@',
				label: '@',
				required: '@',
				show: '=',
				checkemail: '@'
			},
			replace: true,
			transclude: true,
			priority: 10,
			templateUrl: '/app/views/form/input.html',
			compile: compileFunc
		};

		return directive;

		//function templateFunc(tElement, tAttrs) {
		//	if(tAttrs.show) return '/api/views/parts/input-show/';
		//	else return '/api/views/parts/input/';
		//}

		function compileFunc(tElement, tAttrs) {
			var input = tElement.find('input')[0];
			angular.forEach(tAttrs, function(value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'class') return;
				if (key == 'show') {
					tElement[0].setAttribute('ng-if', value);
				}

				if (key == 'datepicker' || key == 'datetimepicker' || key == 'timepicker') {
					input.setAttribute('class', key);
					return;
				}

				if(key == 'checkemail') {
					input.setAttribute('is-duplicate-email', true);
					input.setAttribute('ng-model-options', '{debounce:'+value+'}');

					return;
				}

				//if(key == 'blur') {
				//	input.setAttribute('ng-blur', value);
				//
				//	return;
				//}


				input.setAttribute(key, value);
				tElement[0].removeAttribute(key);


			});

			if(input.form) {
				var formName = input.form.getAttribute('name');
				var inputId = formName+'-'+input.getAttribute('name');

				tElement.find('label')[0].setAttribute('for', inputId);
				input.setAttribute('id', inputId);
			}
		}
	}

	function customTextarea() {

		var directive = {
			require: ['ngModel', 'name'],
			restrict: 'AE',
			scope: {
				model: '=',
				name: '@',
				label: '@',
				ckeditor: '@',
				required: '@',
				show: '='
			},
			replace: true,
			transclude: true,
			priority: 10,
			templateUrl: '/app/views/form/textarea.html',
			compile: compileFunc
		};

		return directive;

		function compileFunc(tElement, tAttrs) {
			var input = tElement.find('textarea')[0];

			angular.forEach(tAttrs, function(value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'class') return;
				if (key == 'ckeditor') {
					input.setAttribute('class', key);

					if(value.length) {
						input.setAttribute('class', input.getAttribute('class') + ' editor-simple');
					}

					return;
				}

				input.setAttribute(key, value);
				tElement[0].removeAttribute(key);
			});

			if(input.form) {
				var formName = input.form.getAttribute('name');
				var inputId = formName+'-'+input.getAttribute('name');

				tElement.find('label')[0].setAttribute('for', inputId);
				input.setAttribute('id', inputId);
			}
		}
	}

	function customSelect() {
		var directive = {
			require: ['ngModel', 'name', 'options'],
			restrict: 'AE',
			scope: {
				model: '=',
				name: '@',
				options: '=',
				label: '@',
				required: '@',
				asobject: '@'
			},
			replace: true,
			transclude: true,
			priority: 10,
			templateUrl: templateFunc,
			controller: controllerFunc,
			compile: compileFunc
		};

		return directive;

		function templateFunc(tElement, tAttrs) {
			if(tAttrs.asobject) {
				return '/app/views/form/select-obj.html';
			} else {
				return '/app/views/form/select.html';
			}
		}

		function controllerFunc($scope) {
			if($scope.asobject) {
				$scope.selectValue = '-';
				$scope.$watch('model', function() {
					$scope.model = ($scope.model) ? $scope.model.toString() : '';

					if($scope.model) {
						_.find($scope.options, function(val, key){
							if(key == $scope.model) $scope.selectValue = val;
						});
					}
				});
			} else {
				var newOptions = [];

				for(var i in $scope.options) {
					newOptions.push({key: i.toString(), value: $scope.options[i]});
				}

				$scope.options = newOptions;
				$scope.selectValue = '-';

				$scope.$watch('model', function() {
					$scope.model = ($scope.model) ? $scope.model.toString() : '';

					if($scope.model) {
						var item = _.findWhere(newOptions, {key: $scope.model});

						if(item) {
							$scope.selectValue = item.value;
						}
					}
				});
			}
		}

		function compileFunc(tElement, tAttrs) {
			var input = tElement.find('select')[0];
			angular.forEach(tAttrs, function(value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'class') return;

				input.setAttribute(key, value);
				tElement[0].removeAttribute(key);
			});

			if(input.form) {
				var formName = input.form.getAttribute('name');
				var inputId = formName+'-'+input.getAttribute('name');

				tElement.find('label')[0].setAttribute('for', inputId);
				input.setAttribute('id', inputId);
			}

		}

	}

	function customCheckbox() {

		var directive = {
			require: ['ngModel', 'name'],
			restrict: 'AE',
			templateUrl: '/app/views/form/checkbox.html',
			scope: {
				model: '=',
				name: '@',
				label: '@',
				required: '@'
			},
			replace: true,
			transclude: true,
			priority: 10,
			compile: compileFunc
		};

		return directive;

		function compileFunc(tElement, tAttrs) {
			var input = tElement.find('input')[0];

			angular.forEach(tAttrs, function(value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'class') return;

				input.setAttribute(key, value);
				tElement[0].removeAttribute(key);
			});

			if(input.form) {
				var formName = input.form.getAttribute('name');
				var inputId = formName+'-'+input.getAttribute('name');

				tElement.find('label')[0].setAttribute('for', inputId);
				input.setAttribute('id', inputId);
			}
		}
	}

	function customRadio() {

		var directive = {
			require: ['ngModel', 'name'],
			restrict: 'AE',
			templateUrl: '/api/views/parts/radio/',
			scope: {
				model: '=',
				name: '@',
				label: '@',
				required: '@',
				options: '='
			},
			replace: true,
			transclude: true,
			priority: 10,
			compile: compileFunc
		};

		return directive;

		function compileFunc(tElement, tAttrs) {
			var input = tElement.find('input')[0];

			angular.forEach(tAttrs, function(value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'class') return;

				input.setAttribute(key, value);
				tElement[0].removeAttribute(key);
			});

			if(input.form) {
				var formName = input.form.getAttribute('name');
				var inputId = formName+'-'+input.getAttribute('name');

				tElement.find('label')[0].setAttribute('for', inputId);
				input.setAttribute('id', inputId);
			}
		}
	}



	function customGallery() {

		var directive = {
			require: [],
			restrict: 'E',
			templateUrl: '/app/modules/dashboard/parts/gallery.html',
			scope: {
				fileType: '@',
				fileSize: '@',
				parent: '=',
				files: '=',
				edit: '='
			},
			controller: controllerFunc,
			replace: true,
			priority: 10
		};

		return directive;

		function controllerFunc($scope, FileUploader, FilesService) {
			$scope.progress = 0;

			$scope.files = $scope.files || [];

			$scope.uploader = new FileUploader({
				url: '/api/common/files?type='+$scope.fileType,
				headers : {'X-CSRF-TOKEN' : BACKEND_CFG.CSRF_TOKEN},
				alias: 'qqfile',
				autoUpload: true,
				removeAfterUpload: true,
				queueLimit: 10,
				filters: [{
					name: 'limit',
					fn: function() {
						if($scope.files.length < 10) {
							return true;
						} else {
							//box.content('Max file size');
							alert('Max file size');
						}
					}
				}],
				onBeforeUploadItem: function() {

				},
				onProgressAll: function (progress) {
					$scope.progress = progress;
				},
				onCompleteItem : function (item, response, status, headers) {
					if(response.error == false) {
						$scope.files.push({name: response.file.name, ext: response.file.ext, url: response.url, token: response.file.token, type: $scope.fileType});

						$scope.src = FilesService.src($scope.fileType, response.file.token, 'tiny');
					} else {
						$scope.uploader.clearQueue();
					}
				},
				onCompleteAll: function() {
					$scope.progress = 0;
				}
			});

			$scope.removeImage = function(file){
				$scope.files = angular.copy(_.without($scope.files, file));
			};
		}
	}

	function avatar() {
		var directive = {
			require: [],
			restrict: 'E',
			templateUrl: '/app/views/form/avatar.html',
			scope: {
				for: '@',
				fileType: '@',
				fileSize: '@',
				parent: '=',
				editmode: '=',
				croparea: '=',
				previewsize: '@',
				updateImage: '=',
				cropEnable: '@',
				cropSize: '=?'
			},
			transclude: true,
			controller: ['$scope', '$http', 'FileUploader', 'FilesService', 'ngDialog', controllerFunc],
			replace: true,
			priority: 10
		};

		return directive;

		function controllerFunc($scope, $http, FileUploader, FilesService, ngDialog) {
			$scope.progress = 0;

			$scope.remove = function() {
				$scope.parent.coverToken = '';
				$scope.src = FilesService.src($scope.fileType, $scope.parent.coverToken, $scope.previewsize || 'preview');
			};

			//if($scope.$parent.editMode) {
			$scope.uploader = new FileUploader({
				url: '/api/common/files?type='+$scope.fileType,
				headers : {'X-CSRF-TOKEN' : BACKEND_CFG.CSRF_TOKEN},
				alias: 'qqfile',
				autoUpload: true,
				removeAfterUpload: true,
				onBeforeUploadItem: function() {

				},
				onProgressAll: function (progress) {
					$scope.progress = progress;
				},
				onCompleteItem : function (item, response, status, headers) {
					if(!response.error) {
						$scope.parent.coverToken = response.file.token;
						$scope.src = response.url;
						//if($scope.fileSize === 'original') {
						//	$scope.src = response.url;
						//} else {
						//	$scope.src = FilesService.src($scope.fileType, response.token,  $scope.previewsize || 'preview');
						//}
						//$scope.updateImage = FilesService.src($scope.fileType, response.token, 'original');
					} else {
						$scope.uploader.clearQueue();

						ngDialog.open({
							template: 'error',
							plain: true,
							scope: $scope
						});
					}
				},
				onCompleteAll: function() {
					$scope.progress = 0;
				}
			});

			console.log($scope.parent.coverToken);

			$scope.src = FilesService.src($scope.fileType, $scope.parent.coverToken, $scope.previewsize || 'preview', $scope.parent.ext || false)  + '?decache=' + Math.floor(Math.random() * 1000);

			// Crop
			$scope.objCrop = {};

			$scope.cropInit = function() {
				log($scope);
				$scope.objCrop.size = $scope.cropSize || [380,285];

				if($scope.croparea) {
					$scope.objCrop.coords = {
						x: $scope.croparea.x,
						y: $scope.croparea.y,
						w: $scope.croparea.x2 - $scope.croparea.x,
						h: $scope.croparea.y2 - $scope.croparea.y,
						sizes: ['preview']
					};
				} else {
					$scope.objCrop.coords = {
						x: 0,
						y: 0,
						w: 0,
						h: 0,
						sizes: ['preview']
					};
				}

				$scope.objCrop.selected = function(coord) {
					$scope.objCrop.coords = {
						'x': coord.x,
						'y': coord.y,
						'x2': coord.x2,
						'y2': coord.y2,
						'w': coord.w,
						'h': coord.h,
						'cropAreaWidth':  coord.originalW,
						'sizes': ['preview']
					};
				}

				$scope.objCrop.src = FilesService.src($scope.fileType, $scope.parent.coverToken, 'original');

				ngDialog.open({
					template: '/tpl/parts/crop/',
					scope: $scope,
					className: 'crop-outer ngdialog-theme-default'
				});
			};

			$scope.crop = function() {
				$scope.src = '';
				$http.post('/files/crop/'+$scope.parent.coverToken+'/1/', $scope.objCrop.coords).success(function(res){
					$scope.src = FilesService.src($scope.fileType, $scope.parent.coverToken, 'preview') + '?decache=' +  Math.floor(Math.random() * 1000);
				});
				ngDialog.closeAll();
			};
		}
	}

	function imgCropped() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				src:'@',
				coords: '=',
				selected:'=',
				size:'='
			},
			link: function(scope, element, attr) {
				var myImg;
				var clear = function() {
					if (myImg) {
						myImg.next().remove();
						myImg.remove();
						myImg = undefined;
					}
				};
				scope.$watch('src', function(nv) {
					clear();
					if (nv) {
						element.after('<img />');
						myImg = element.next();
						myImg.attr('src', nv);

						var temp = new Image();
						temp.src = nv;
						temp.onload = function() {
							var width = this.width;
							var height = this.height;

							$(myImg).Jcrop({
								trackDocument: true,
								onSelect: function(x) {
									x.originalW = width;
									scope.selected(x);
								},
								aspectRatio: scope.size[0]/scope.size[1],
								boxWidth: 500, boxHeight: 250,
								setSelect: [0, 0, scope.size[0], scope.size[1]],
								trueSize: [width, height]
							});
						}
					}
				});

				scope.$on('$destroy', clear);
			}
		};
	}

	function geocompleteInput() {

		var directive = {
			require: ['ngModel'],
			restrict: 'AE',
			templateUrl: '/app/views/form/partials/geocomplete.html',
			scope: {
				model: '=',
				placeholder: '@',
				name : '@',
				//label: '@',
				country: '@'
			},
			replace: true,
			transclude: true,
			priority: 10,
			compile: compileFunc,
			controller: controllerFunc
		};

		return directive;

		function compileFunc(tElement, tAttrs) {
			var input = tElement.find('input')[0];
			angular.forEach(tAttrs, function(value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'label') return;
				if (key == 'show') {
					tElement[0].setAttribute('ng-show', value);
				}

				input.setAttribute(key, value);
				tElement[0].removeAttribute(key);
			});
		}

		function controllerFunc($scope, $element) {
			var geoConfig = {};
			if($scope.country) {
				geoConfig.componentRestrictions = { country: $scope.country };
			}
			var input = $($element).find('input');
			$scope.originaladdress  = angular.copy($scope.value);
			input.geocomplete(geoConfig)
				.bind("geocode:result", function(event, result){
					$scope.$apply();
				})
				.bind("geocode:error", function(event, status){
					log("ERROR: " + status);
				});
			if($scope.model) {
				input.geocomplete("find", $scope.model);
				//					input.val($scope.model).trigger('geocode');
			}

		}
	}

	function customCover() {

		var directive = {
			require: [],
			restrict: 'E',
			templateUrl: '/api/views/parts/cover/',
			scope: {
				model: '=',
				parent: '=',
				fileType: '@',
				fileSize: '@'
			},
			controller: controllerFunc,
			replace: true,
			priority: 10
		};

		return directive;

		function controllerFunc($scope, FileUploader, FilesService) {
			$scope.progress = 0;

			$scope.remove = function() {
				$scope.parent.coverToken = '';
				$scope.src = FilesService.src($scope.fileType, $scope.parent.coverToken, 'preview');
			};

			//if($scope.$parent.editMode) {
			$scope.uploader = new FileUploader({
				url: '/files/upload/'+$scope.fileType+'/',

				alias: 'qqfile',
				autoUpload: true,
				removeAfterUpload: true,
				onBeforeUploadItem: function() {

				},
				onProgressAll: function (progress) {
					$scope.progress = progress;
				},
				onCompleteItem : function (item, response, status, headers) {
					if(response.success) {
						$scope.model = response.token;
						$scope.src = FilesService.src($scope.fileType, response.token, 'preview');
					} else {
						$scope.uploader.clearQueue();
					}
				},
				onCompleteAll: function() {
					$scope.progress = 0;
				}
			});

			$scope.src = FilesService.src($scope.fileType, $scope.parent.coverToken, 'preview');

			$scope.myImage = '';
		}
	}

	function exampleDirective() {
		var directive = {
			restrict: 'EA',
			controller: controllerFunc,
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

		function controllerFunc( $scope, $element, $attrs, $transclude ) {
			// Controller code goes here.
		}
	}

})();
