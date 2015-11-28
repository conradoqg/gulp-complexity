# [gulp](https://github.com/wearefractal/gulp)-complexity

> Analize the complexity and maintainability of code

*Twin brother of [grunt-complexity](https://github.com/vigetlabs/grunt-complexity) task*

## Install

	npm install --save-dev gulp-complexity

## Example

	var gulp = require('gulp'),
		complexity = require('gulp-complexity');

	gulp.task('default', function(){
		return gulp.src('*.js')
			.pipe(complexity());
	});

## Options

    Array `maintainability` - [Error, Warning] threshold for files (more is better). Default: [80, 120]
	Array `cyclomatic` - [Warning, Error] threshold for functions (less is better). Default: [7, 12]
    Array `halstead` - [Warning, Error] threshold for functions (less is better). Default: [13, 20]

    Bool `breakOnErrors` - Fail the task when files or functions are too complex and with errors. Default: true
    Bool `breakOnWarnings` - Fail the task when files or functions are too complex and with warnings. Default: false
    Bool `showFileSuccess` - Show statistics of successful files. Default: false
    Bool `showFileWarning` - Show statistics of files with warnings. Default: true
    Bool `showFileError` - Show statistics of files with errors. Default: true
    Bool `showFunctionSuccess` - Show statistics of successful functions. Default: false
    Bool `showFunctionWarning` - Show statistics of functions with warnings. Default: true
    Bool `showFunctionError` - Show statistics of functions with errors. Default: true
    Bool `verbose` - Show output at all. Default: true

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) (c) Alexey Raspopov


