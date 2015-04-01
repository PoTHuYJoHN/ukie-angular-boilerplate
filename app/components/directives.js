(function() {
	'use strict';

	angular.module("dashboard.directives", [])

		.directive('ngReallyClick', ngReallyClick)
		.directive('ckeditor', ckeditor)
	;

	/**
	 * A generic confirmation for risky actions.
	 * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
	 */
	function ngReallyClick() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('click', function() {
					var message = attrs.ngReallyMessage;
					if (message && confirm(message)) {
						scope.$apply(attrs.ngReallyClick);
					}
				});
			}
		}
	}

	ckeditor.$inject = ['$window', '$timeout', '$q', '$location', '$compile'];
	function ckeditor($window, $timeout, $q, $location, $compile) {
		var directive = {
			restrict: 'C',
			require: ['ngModel'],
			scope: false,
			priority: 10,
			link: linkFunc
		};

		return directive;

		function linkFunc(scope, element, attrs, ctrls) {
			//CKEDITOR.plugins.addExternal('youtube', '/resources/vendor/ckeditor-youtube-plugin/youtube/');
			//CKEDITOR.plugins.addExternal('gallery', '/resources/vendor/ckeditor-gallery/');
			//CKEDITOR.plugins.addExternal('autosave', '/resources/vendor/ckeditor-autosave/');

			//CKEDITOR.document.appendStyleSheet('/resources/vendor/ckeditor-gallery/css/style.css');

			var ngModel = ctrls[0];
			var form = ctrls[1] || null;

			var EMPTY_HTML = '<p></p>';
			var isTextarea = element[0].tagName.toLowerCase() == 'textarea';
			var data = [];
			var isReady = false;

			element.attr('contenteditable', true);

			var onLoad = function () {
				var options = element.hasClass('editor-simple') ? {
					toolbar : [
						[ 'Cut', 'Copy', '-', 'PasteText', 'PasteFromWord' ],
						[ 'Link', 'Unlink' ],
						[ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyFull' ],
						[ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ],
						[ 'TextColor', 'BGColor' ]
					]
				} : {
					//extraPlugins : 'sourcedialog,youtube,gallery,autosave', //
					plugins: 'basicstyles,blockquote,clipboard,colorbutton,colordialog,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,floatingspace,font,format,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,link,list,liststyle,magicline,pagebreak,pastefromword,pastetext,removeformat,resize,scayt,showblocks,showborders,stylescombo,tab,table,tabletools,toolbar,undo,wsc,wysiwygarea',
					toolbar : [
						[ 'Undo', 'Redo' ],
						[ 'Cut', 'Copy', '-', 'PasteText', 'PasteFromWord' ],
						[ 'Styles' ],
						[ 'Format' ],
						[ 'Font' ],
						[ 'FontSize' ],
						[ 'Image', 'Gallery', 'Youtube', 'Iframe', 'Link', 'Unlink' ], //
						[ 'Table', 'HorizontalRule' ],
						[ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyFull' ],
						[ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ],
						[ 'TextColor', 'BGColor' ],
						[ 'BulletedList', 'NumberedList', '-', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv' ],
						[ 'ShowBlocks', 'Source', '-', 'Sourcedialog' ]
					],
					//contentsCss: ['/resources/vendor/ckeditor-gallery/css/style.css', '/resources/vendor/ckeditor/contents.css', '/resources/vendor/ckeditor-autosave/css/autosave.min.css'],
					extraAllowedContent: 'gallery'
					//disallowedContent: 'config'
					//disallowedContent: 'div(cke_gallery_content)'
				};

				options = angular.extend({
					disableNativeSpellChecker: false,
					language: 'en',
					uiColor: '#FAFAFA',
					height: '250px',
					width: '100%',
					forcePasteAsPlainText: true,
					format_tags: 'p;div;h1;h2;h3;h4;h5;h6;pre',
					//fillEmptyBlocks: false,
					baseFloatZIndex: 100,
					enterMode: CKEDITOR.ENTER_P,
					shiftEnterMode: CKEDITOR.ENTER_BR,
					//autoParagraph: false,
					allowedContent: true, //'h1 h2 h3 p blockquote strong em;a[!href];img(left,right)[!src,alt,width,height];'
					disallowedContent: true
					//removeFormatTags: 'b,big,code,del,dfn,em,font,i,ins,kbd'
				}, options);

				options = angular.extend(options, scope[attrs.ckeditor]);

				//CKEDITOR.disableAutoInline = true;
				//CKEDITOR.dtd.$editable.span = 1;
				//CKEDITOR.dtd.$editable.li = 1;
				//CKEDITOR.dtd.$editable.a = 1;

				element[0].setAttribute('id', attrs.id);

				var instance = CKEDITOR.inline(element[0], options); //(isTextarea) ? CKEDITOR.replace(element[0], options) : CKEDITOR.inline(element[0], options);
				var configLoaderDef = $q.defer();

				//// Fixes for autosave
				//if(scope.$parent.ckeditor && scope.$parent.ckeditor !== '' && scope.$parent.ckeditor.length > 2) {
				//	instance.id = 'cke_'+scope.$parent.ckeditor;
				//} else {
				//	instance.id = 'cke_'+$location.url().replace(/[^a-zA-Z_\-=0-9 ]/g, "");
				//}
				//scope.$root.$on('submit', function(){
				//	localStorage.removeItem('autosave_' + $window.location + "_" + instance.id);
				//});
				//// End autosave fixes

				element.bind('$destroy', function () {
					instance.destroy(
						false //If the instance is replacing a DOM element, this parameter indicates whether or not to update the element with the instance contents.
					);
				});

				var setModelData = function(setPristine) {
					var data = instance.getData();

					//.replace(/&nbsp;/g,'').replace(/<p><\/p>/g,'').replace(/(\r\n|\n|\r)/gm,"")

					if(typeof editorGallery !== 'undefined') {
						data = editorGallery.parseData(data);
					}

					if (data === '') {
						data = null;
					}
					$timeout(function () { // for key up event
						if(setPristine !== true || data != ngModel.$viewValue) ngModel.$setViewValue(data || EMPTY_HTML);
						if(setPristine === true && form) form.$setPristine();
					}, 0);
				}, onUpdateModelData = function(setPristine) {

					if (!data.length) { return; }
					var item = data.pop() || EMPTY_HTML;
					isReady = false;
					instance.setData(item, function () {
						setModelData(setPristine);
						isReady = true;
					});
				};

				instance.on('change', setModelData);
				instance.on('blur', setModelData);

//				instance.on('pasteState', setModelData);
//				instance.on('key', setModelData);
//				instance.on('dataReady', setModelData);
//				instance.on('paste', setModelData);

				instance.on('instanceReady', function() {
					scope.$broadcast("ckeditor.ready");
					scope.$apply(function() {
						onUpdateModelData(true);
					});
					instance.document.on("keyup", setModelData);
				});
				instance.on('customConfigLoaded', function() {
					configLoaderDef.resolve();
				});

//				instance.on('instanceDestroyed', function(evt){
//					instance.destroy(true);
//				});

				ngModel.$render = function() {
					data.push(ngModel.$viewValue);
					if (isReady) {
						onUpdateModelData();
					}
				};
			};

			onLoad();
		}
	}
})();
