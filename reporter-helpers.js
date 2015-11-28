/* jshint node:true */
exports.fitWhitespace = function(maxLength, string){
	// Prevent negative values from breaking the array
	var remaining = Math.max(0, maxLength - string.length);

	return string + Array(remaining + 3).join(' ');
};

exports.longestString = function(strings){
	return strings.reduce(function(maxLength, string){
		return Math.max(maxLength, string.length);
	}, 0);
};

var levels = {};
levels.success = {
	code: 1,
	symbol: '\u2713',
	color: 'green'
};
levels[1] = levels.success;
levels.warning = {
	code: 2,
	symbol: '\u2732',
	color: 'yellow'
};
levels[2] = levels.warning;
levels.error = {
	code: 3,
	symbol: '\u2717',
	color: 'red'
};
levels[3] = levels.error;

exports.levels = levels;

exports.leveler = function(minStyle, medStyle, maxStyle) {
	return function(value, min, max) {
		var style = {
			code: 0,
			symbol: '?',
			color: 'white'
		};

		if (value < min) {
			style = minStyle;
		} else if ( value < max ) {
			style = medStyle;
		} else if ( value >= max ) {
			style = maxStyle;
		}

		return style;
	};
};

exports.normalLeveler = this.leveler(levels.success, levels.warning, levels.error);

exports.invertedLeveler = this.leveler(levels.error, levels.warning, levels.success);

exports.generateBar = function(score, threshold){
	var chalk = require('chalk'),

		// 17.1 for 1/10 of 171, the maximum score
		magnitude = Math.floor(score / 17.1),
		bar = Array(magnitude).join('\u2588') + Array(11 - magnitude).join(' '),

		// Out of 171 points, what % did it earn?
		rating = score / threshold;

    return bar;
};