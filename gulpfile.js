var gulp         = require('gulp'),
	browserSync  = require('browser-sync'),
	stylus       = require('gulp-stylus'),
	coffee       = require('gulp-coffee'),
	jade         = require('gulp-jade'),
	del          = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano      = require('gulp-cssnano'),
	cache        = require('gulp-cache'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	uglify      = require('gulp-uglifyjs'),
	concat       = require('gulp-concat');

var config       = require('./config');



gulp.task('watch', ['browser-sync'], function(){
	gulp.watch(config.srcFolder + '/stylus/**/*.styl', ['stylus']);
	gulp.watch(config.srcFolder + '/coffee/**/*.coffee', ['coffee']);
	gulp.watch(config.srcFolder + '/**/*.jade', ['jade']);
});


gulp.task('jade', function() {
	return gulp.src(config.srcFolder + '/**/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(config.srcFolder))
		.pipe(browserSync.stream())
});


gulp.task('stylus', function() {
	return gulp.src(config.srcFolder + '/stylus/**/*.styl')
		.pipe(stylus())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 6-8'], {cascade: true}))
		.pipe(gulp.dest(config.srcFolder + '/css'))
		.pipe(browserSync.stream())
});


gulp.task('coffee', function() {
	return gulp.src(config.srcFolder + '/coffee/**/*.coffee')
		.pipe(coffee())
		.pipe(gulp.dest(config.srcFolder + '/js'))
		.pipe(browserSync.stream())
});


gulp.task('jsLibs', function() {
	return gulp.src(config.buildJsLibs)
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.srcFolder + '/js'))
});


gulp.task('cssLibs', function() {
	return gulp.src(config.buildCssLibs)
		.pipe(concat('libs.min.css'))
		.pipe(cssnano())
		.pipe(gulp.dest(config.srcFolder + '/css'))
});




gulp.task('browser-sync', ['jsLibs', 'cssLibs', 'jade', 'stylus', 'coffee'], function(){
	browserSync({
		server:{
			baseDir: config.srcFolder
		},
		notify: false
	})
});




gulp.task('img', function() {
	return gulp.src(config.srcFolder + '/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(config.distFolder + "/img"))
});


gulp.task('clean', function() {
	return del.sync('dist');
});


gulp.task('build', ['clean', 'img', 'jade', 'stylus', 'coffee', 'jsLibs', 'cssLibs'], function() {
	var buildHtml = gulp.src(config.srcFolder + "/**/*.html")
		.pipe(gulp.dest(config.distFolder));

	var buildCss = gulp.src(config.srcFolder + "/css/**/*.css")
	.pipe(gulp.dest(config.distFolder + '/css'));

	var buildJs = gulp.src(config.srcFolder + "/js/**/*.js")
		.pipe(gulp.dest(config.distFolder + '/js'));

	var buildFonts = gulp.src(config.srcFolder + '/fonts/**/*')
		.pipe(gulp.dest(config.distFolder + '/fonts'))
});


gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);