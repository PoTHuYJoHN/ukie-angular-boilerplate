(function() {
	'use strict';

	angular.module("common.filters", [])

		.filter('capitalize', capitalize)
		.filter('slugify', slugify)
		.filter('getCover', getCover) // get file url by token and type
	;
	//Capitalize first letter in first word or all words
	function capitalize() {
		return function(input, all) {
			var pattern = all
				? /([^\W_]+[^\s-]*) */g
				: /([^\W_]+[^\s-]*) */;
			return (!!input)
				? input.replace(pattern ,
					function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
				: '';
		}
	}

	// Slugify words
	function slugify() {
		return function(input) {
			return input.toString().toLowerCase()
			    .replace(/\s+/g, '-')           // Replace spaces with -
			    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
			    .replace(/^-+/, '')             // Trim - from start of text
			    .replace(/-+$/, '');            // Trim - from end of text
		}
	}
	//cover of item
	getCover.$inject = ['FilesService'];
	function getCover(FilesService) {
		return function(token, type, size, ext) {
			size = size || 'preview';
			ext = ext || false;

			return FilesService.src(type, token, size, ext);
		};
	}

})();
