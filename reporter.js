/* jshint node:true */
var multiline, template, reportTemplate, gutil, reportFn;

multiline = require('multiline');
template = require('string-interpolate');
gutil = require('gulp-util');

fullReportFn = template(fullReportTemplate);

fileTemplate = multiline(function(){/*
{ check } { fittedName } { bar } - { maintainability }: Cycl: { cyclomatic }, Hal: { halstead } ( Bugs: { bugs }, Eff: { effort }, Vol: { volume }, Voc: { vocabulary } )
*/});

fileReportFn = template(fileTemplate);

functionTemplate = multiline(function(){/*
    { check } { path }:{ line } - { name }: Cycl: { cyclomatic }, Hal: { halstead } ( Bugs: { bugs }, Eff: { effort }, Vol: { volume }, Voc: { vocabulary } )
*/});

functionReportFn = template(functionTemplate);

exports.log = function(file, report, options, fittedName){
	var chalk = require('chalk'),
		path = require('path'),
		name = path.relative(file.cwd, file.path),
		helpers = require('./reporter-helpers'),
		valid = true;

	var maintainabilityStatus = helpers.invertedLeveler(report.maintainability, options.maintainability[0], options.maintainability[1])
	var cyclomaticStatus = helpers.normalLeveler(report.aggregate.complexity.cyclomatic, options.cyclomatic[0], options.cyclomatic[1])
	var halsteadStatus = helpers.normalLeveler(report.aggregate.complexity.halstead.difficulty, options.halstead[0], options.halstead[1]);

	if (
		options.showFileSuccess && maintainabilityStatus.code === 1 ||
		options.showFileWarning && maintainabilityStatus.code === 2 ||
		options.showFileError && maintainabilityStatus.code === 3
		) {
		gutil.log(fileReportFn({
			check: chalk[maintainabilityStatus.color](maintainabilityStatus.symbol),
			fittedName: fittedName,
			bar: chalk[maintainabilityStatus.color](helpers.generateBar(report.maintainability, options.maintainability)),
			maintainability: chalk[maintainabilityStatus.color](report.maintainability.toFixed(2)),
			cyclomatic: chalk[cyclomaticStatus.color](report.aggregate.complexity.cyclomatic.toFixed(2)),
			halstead: chalk[halsteadStatus.color](report.aggregate.complexity.halstead.difficulty.toFixed(2)),
			bugs: chalk[halsteadStatus.color](report.aggregate.complexity.halstead.bugs.toFixed(2)),
			effort: chalk[halsteadStatus.color](report.aggregate.complexity.halstead.effort.toFixed(2)),
			volume: chalk[halsteadStatus.color](report.aggregate.complexity.halstead.volume.toFixed(2)),
			vocabulary: chalk[halsteadStatus.color](report.aggregate.complexity.halstead.vocabulary.toFixed(2)),
		}));
	};

	report.functions.map(function(fn){
		var cyclomaticStatus = helpers.normalLeveler(fn.complexity.cyclomatic, options.cyclomatic[0], options.cyclomatic[1])
		var halsteadStatus = helpers.normalLeveler(fn.complexity.halstead.difficulty, options.halstead[0], options.halstead[1]);

		if  (
			options.showFunctionSuccess && (cyclomaticStatus.code === 1 || halsteadStatus.code === 1) ||
			options.showFunctionWarning && (cyclomaticStatus.code === 2 || halsteadStatus.code === 2) ||
			options.showFunctionError && (cyclomaticStatus.code === 3 || halsteadStatus.code === 3)
			) {
			gutil.log(functionReportFn({
				check: chalk[helpers.levels[Math.max(cyclomaticStatus.code, halsteadStatus.code)].color](helpers.levels[Math.max(cyclomaticStatus.code, halsteadStatus.code)].symbol),
			path: name,
			line: fn.line,
			name: fn.name,
				cyclomatic: chalk[cyclomaticStatus.color](fn.complexity.cyclomatic.toFixed(2)),
				halstead: chalk[halsteadStatus.color](fn.complexity.halstead.difficulty.toFixed(2)),
				bugs: chalk[halsteadStatus.color](fn.complexity.halstead.bugs.toFixed(2)),
				effort: chalk[halsteadStatus.color](fn.complexity.halstead.effort.toFixed(2)),
				volume: chalk[halsteadStatus.color](fn.complexity.halstead.volume.toFixed(2)),
				vocabulary: chalk[halsteadStatus.color](fn.complexity.halstead.vocabulary.toFixed(2))
			}));
		};
	});
};
