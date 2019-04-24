// project name

var project = __dirname.split(/\/|-/).pop();

// dependencies

var gulp = require('gulp');
var connect = require('gulp-connect');
var connectphp = require('gulp-connect-php');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var special = require('gulp-special-html');
var clean = require('gulp-clean');
var prerequisites = require('./prerequisites.json');

// prerequisites

function task_import(cb) {
	prerequisites.forEach(function(a) {
		gulp.src(['../useful-' + a + '/dist/js/*.js', '../useful-' + a + '/dist/lib/*.js'])
			.pipe(gulp.dest('src/lib/'));
	});
	cb();
}

// server

function task_connect(cb) {
	connect.server({
		port: 8500,
		root: 'dist/',
		livereload: {
			port: 35939
		}
	});
	cb();
}

function task_connectphp(cb) {
	connectphp.server({
		port: 8500,
		base: 'dist/'
	});
	cb();
}

// dynamic reload

function task_connect_html(cb) {
  gulp.src('dist/**/*.html')
    .pipe(connect.reload());
	cb();
}

function task_connect_css(cb) {
  gulp.src('dist/**/*.css')
    .pipe(connect.reload());
	cb();
}

function task_connect_js(cb) {
  gulp.src('dist/**/*.js')
    .pipe(connect.reload());
	cb();
}

// pre-process

function task_clean(cb) {
	gulp.src('dist/*', {
			read: false
		})
		.pipe(clean());
	cb();
}

function task_markup(cb) {
	gulp.src(['src/*.html', 'src/*.php'])
		.pipe(special())
		.pipe(gulp.dest('dist/'));
	gulp.src('src/html/**/*.html')
		.pipe(special())
		.pipe(gulp.dest('dist/html/'));
	gulp.src('src/php/**/*.php')
		.pipe(special())
		.pipe(gulp.dest('dist/php/'));
	cb();
}

function task_assets(cb) {
	gulp.src('src/xml/**/*').pipe(gulp.dest('dist/xml/'));
	gulp.src('src/lib/**/*').pipe(gulp.dest('dist/lib/'));
	gulp.src('src/data/**/*').pipe(gulp.dest('dist/data/'));
	gulp.src('src/tiles/**/*').pipe(gulp.dest('dist/tiles/'));
	gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts/'));
	gulp.src('src/json/**/*').pipe(gulp.dest('dist/json/'));
	gulp.src('src/photos/**/*').pipe(gulp.dest('dist/photos/'));
	cb();
}

function task_images(cb) {
	gulp.src(['src/img/**/*.gif', 'src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg'])
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: true
			}],
			use: [pngquant()]
		}))
		.on('error', errorHandler)
		.pipe(gulp.dest('dist/img'));
	cb();
}

function task_styles_dev(cb) {
	gulp.src(['src/lib/*.scss', 'src/scss/*.scss'])
  	.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
  	.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css/'));
	cb();
}

function task_styles_dist(cb) {
	gulp.src(['src/lib/*.scss', 'src/scss/*.scss'])
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist/css/'));
	cb();
}

function task_scripts_dev(cb) {
	gulp.src(['src/js/' + project + '.js', 'src/js/*.js'])
		.pipe(concat(project + '.js'))
		.pipe(gulp.dest('dist/js/'));
	cb();
}

function task_scripts_dist(cb) {
	gulp.src(['src/js/' + project + '.js', 'src/js/*.js'])
		.pipe(concat(project + '.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'));
	cb();
}

// watch changes

function task_default(cb) {
	gulp.watch(['src/**/*.html', 'src/**/*.php'], task_markup);
	gulp.watch(['src/scss/*.scss'], task_styles_dev);
	gulp.watch(['src/js/*.js'], task_scripts_dev);
	gulp.watch(['dist/**/index.html'], task_connect_html);
  gulp.watch(['dist/css/**/*.css'], task_connect_css);
  gulp.watch(['dist/js/**/*.js'], task_connect_js);
	cb();
}

// tasks

exports.clean = gulp.series(
	task_clean
);
exports.dist = gulp.series(
	task_import,
	task_markup,
	task_assets,
	task_images,
	task_styles_dist,
	task_scripts_dist
);
exports.dev = gulp.series(
	task_import,
	task_markup,
	task_assets,
	task_images,
	task_styles_dev,
	task_scripts_dev
);
exports.php = gulp.series(
	task_default,
	task_connectphp
);
exports.serve = gulp.series(
	task_default,
	task_connect
);
exports.default = task_default;

// errors

function errorHandler(error) {
	console.log(error.toString());
	this.emit('end');
}
