'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	cleanhtml = require('gulp-cleanhtml'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	stripdebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify'),
	concat  = require('gulp-concat'),
	merge = require('merge-stream'),
	zip = require('gulp-zip');

//clean build directory
gulp.task('clean', function() {
	return gulp.src('build/*', {read: false})
		.pipe(clean());
});

//copy static folders to build directory
gulp.task('copy', function() {
	var src = gulp.src('src/fonts/**')
		.pipe(gulp.dest('build/fonts'));
	var icons = gulp.src('src/icons/**')
		.pipe(gulp.dest('build/icons'));
	var img = gulp.src('src/img/**')
		.pipe(gulp.dest('build/img'));
	var locales = gulp.src('src/_locales/**')
		.pipe(gulp.dest('build/_locales'));
	var manifest = gulp.src('src/manifest.json')
		.pipe(gulp.dest('build'));

	return merge(src,icons,img,locales,manifest);
});

//copy and compress HTML files
gulp.task('html', function() {
	return gulp.src('src/*.html')
		.pipe(cleanhtml())
		.pipe(gulp.dest('build'));
});

//run scripts through JSHint
gulp.task('jshint', function() {
	return gulp.src('src/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//copy vendor scripts and uglify all other scripts
gulp.task('scripts', ['jshint'], function() {
	var vendorsScripts = gulp.src([
			'src/scripts/vendors/jquery.min.js',
			'src/scripts/vendors/bootstrap.min.js',
			'src/scripts/vendors/angular.min.js',
			'src/scripts/vendors/lodash.min.js'])
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('build/scripts'));

	var appScripts =  gulp.src(['src/scripts/**/*.js', '!src/scripts/vendors/**/*.js'])
		.pipe(stripdebug())
		.pipe(concat('app.js'))
		.pipe(uglify({outSourceMap: false}))
		.pipe(gulp.dest('build/scripts'));

	return merge(vendorsScripts,appScripts);
});

//minify styles
gulp.task('styles', function() {
 	return gulp.src('src/styles/**/*.css')
 		.pipe(minifycss({ keepSpecialComments: 0}))
 		.pipe(gulp.dest('build/styles'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['html', 'scripts', 'styles', 'copy'], function() {
	var manifest = require('./src/manifest'),
		distFileName = manifest.name + ' v' + manifest.version + '.zip',
		mapFileName = manifest.name + ' v' + manifest.version + '-maps.zip';
	//collect all source maps
	var sourceMaps = gulp.src('build/scripts/**/*.map')
		.pipe(zip(mapFileName))
		.pipe(gulp.dest('dist'));
	//build distributable extension
	var zipFile = gulp.src(['build/**', '!build/scripts/**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));

	return merge(sourceMaps,zipFile);
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function() {
    gulp.start('zip');
});