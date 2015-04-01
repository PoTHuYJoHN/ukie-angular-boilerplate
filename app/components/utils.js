angular
	.module('utils', [])

	.factory('array_util', function() {
		var util_array = {
			partition: partition,
			uniqueItems: uniqueItems,
			chunk: chunk
		};

		return util_array;


		/**
		 * Divide into parts
		 * @param items
		 * @param size
		 * @returns {Array}
		 */
		function partition(items, size) {
			var result = _.groupBy(items, function(item, i) {
				return Math.floor(i/size);
			});
			return _.values(result);
		}

		/**
		 * Return array of unique values from collections
		 * @param data
		 * @param key
		 * @returns {Array}
		 */
		function uniqueItems(data, key) {
			var result = [];
			for (var i = 0; i < data.length; i++) {
				var value = data[i][key];
				if (result.indexOf(value) === -1) {
					result.push(value);
				}
			}
			return result;
		}

		/**
		 * Get {start} nested arrays each containing maximum of {amount} items
		 * @param arr
		 * @param start
		 * @param amount
		 * @returns {Array}
		 */
		function chunk(arr, start, amount){
			var result = [],
				i,
				start = start || 0,
				amount = amount || 500,
				len = arr.length;

			do {
				//console.log('appending ', start, '-', start + amount, 'of ', len, '.');
				result.push(arr.slice(start, start+amount));
				start += amount;

			} while (start< len);

			return result;
		}
	})
;
