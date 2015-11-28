/* jshint node:true */
var cr = require('complexity-report'),
	through = require('through2'),
	gutil = require('gulp-util'),
	extend = require('util-extend'),
	reporter = require('./reporter'),
	util = require('util'),
	PluginError = gutil.PluginError;

function complexity(options){
	options = extend({
		maintainability: [80, 120], // For files
		cyclomatic: [7, 12], // For functions
		halstead: [13, 20], // For functions
		breakOnErrors: true,
		breakOnWarnings: false,
		showFileSuccess: false,
		showFileWarning: true,
		showFileError: true,
		showFunctionSuccess: false,
		showFunctionWarning: true,
		showFunctionError: true,
		verbose: true
	}, options);

	// always making sure threasholds are arrays
	if(!Array.isArray(options.cyclomatic)){
		options.cyclomatic = [options.cyclomatic, options.cyclomatic];
	}

	if(!Array.isArray(options.halstead)){
		options.halstead = [options.halstead, options.halstead];
	}

	var files = [];
	var errorCount = 0;

	return through.obj(function(file, enc, cb){
		if(file.isNull()){
			return cb(null, file);
		}

		if(file.isStream()){
			return cb(new PluginError('gulp-complexity', 'Streaming not supported'));
		}

		files.push(file);
		cb(null, file);
	}, function(cb){
		var path = require('path'),
			helpers = require('./reporter-helpers'),
			count = [0,0,0,0];

		var maxLength = helpers.longestString(files.map(function(file){
			return path.relative(file.cwd, file.path);
		}));

		files.filter(function(file){
			return file.contents.toString().length > 0;
		}).forEach(function(file){
			var base = path.relative(file.cwd, file.path);
			var report = cr.run(file.contents.toString(), options);

			var maintainabilityStatus = helpers.invertedLeveler(report.maintainability, options.maintainability[0], options.maintainability[1])
			count[maintainabilityStatus.code]++;

			report.functions.map(function(fn){
				var cyclomaticStatus = helpers.normalLeveler(fn.complexity.cyclomatic, options.cyclomatic[0], options.cyclomatic[1])
				var halsteadStatus = helpers.normalLeveler(fn.complexity.halstead.difficulty, options.halstead[0], options.halstead[1]);
		                count[cyclomaticStatus.code]++;
                		count[halsteadStatus.code]++;
			});

			if (options.verbose) {
				reporter.log(file, report, options, helpers.fitWhitespace(maxLength, base));
			}
		});

		if (
			options.breakOnErrors && count[3] > 0 ||
			options.breakOnWarnings && count[2] > 0
			) {
			this.emit('error', new PluginError('gulp-complexity', util.format('Complexity too high, found %d error(s) and %d warning(s).', count[3], count[2])));
		}

		cb();
	});
}

module.exports = complexity;
