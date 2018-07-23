// project name

var project = __dirname.split(/\/|-/).pop();

// dependencies

var gulp = require('gulp'),
	connect = require('gulp-connect'),
	connectphp = require('gulp-connect-php'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	special = require('gulp-special-html'),
	clean = require('gulp-clean'),
	prerequisites = [
		//'polyfills',
		//'requests'
	];

// prerequisites

gulp.task('unimport', function() {
	gulp.src('src/lib/*', {read: false})
		.pipe(clean());
});

gulp.task('import', function() {
	prerequisites.forEach(function(a) {
		gulp.src('../useful-' + a + '/dist/js/*.js', {base: '../useful-' + a + '/dist/js/'})
			.pipe(gulp.dest('src/lib/'));
	});
});

// server

gulp.task('connect', function() {
	connect.server({
		port: 8500,
		root: 'dist/',
		livereload: {
			port: 35939
		}
	});
});

gulp.task('connectphp', function() {
	connectphp.server({
		port: 8500,
		base: 'dist/'
	});
});

// dynamic reload

gulp.task('connect:html', function () {
  gulp.src('dist/**/*.html')
    .pipe(connect.reload());
});

gulp.task('connect:css', function () {
  gulp.src('dist/**/*.css')
    .pipe(connect.reload());
});

gulp.task('connect:js', function () {
  gulp.src('dist/**/*.js')
    .pipe(connect.reload());
});

// pre-process

gulp.task('clean', function() {
	return gulp.src('dist/*', {
			read: false
		})
		.pipe(clean());
});

gulp.task('markup', function() {
	gulp.src(['src/*.html', 'src/*.php'])
		.pipe(special())
		.pipe(gulp.dest('dist/'));
	gulp.src('src/html/**/*.html')
		.pipe(special())
		.pipe(gulp.dest('dist/html/'));
	gulp.src('src/php/**/*.php')
		.pipe(special())
		.pipe(gulp.dest('dist/php/'));
});

gulp.task('assets', function() {
	gulp.src('src/xml/*.xml')
		.pipe(gulp.dest('dist/xml/'));
	gulp.src('src/tiles/**/*.*')
		.pipe(gulp.dest('dist/tiles/'));
	gulp.src('src/fonts/*')
		.pipe(gulp.dest('dist/fonts/'));
	gulp.src('src/json/**/*.js')
		.pipe(gulp.dest('dist/json/'));
	gulp.src('src/photos/**/*.jpg')
		.pipe(gulp.dest('dist/photos/'));
});

gulp.task('images', function() {
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
});

gulp.task('styles:dev', function() {
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
});

gulp.task('styles:dist', function() {
	gulp.src(['src/lib/*.scss', 'src/scss/*.scss'])
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('scripts:dev', function() {
	gulp.src(['src/lib/*.js', 'src/js/' + project + '.js', 'src/js/*.js'])
		.pipe(concat(project + '.js'))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts:dist', function() {
	gulp.src(['src/lib/*.js', 'src/js/' + project + '.js', 'src/js/*.js'])
		.pipe(concat(project + '.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'));
});

// watch changes

gulp.task('watch', function() {
	gulp.watch(['src/**/*.html', 'src/**/*.php'], ['markup']);
	gulp.watch(['src/scss/*.scss'], ['styles:dev']);
	gulp.watch(['src/js/*.js'], ['scripts:dev']);
	gulp.watch(['dist/**/index.html'], ['connect:html']);
  gulp.watch(['dist/css/**/*.css'], ['connect:css']);
  gulp.watch(['dist/js/**/*.js'], ['connect:js']);
});

// tasks

gulp.task('dist', ['import', 'markup', 'assets', 'images', 'styles:dist', 'scripts:dist']);
gulp.task('dev', ['import', 'markup', 'assets', 'images', 'styles:dev', 'scripts:dev']);
gulp.task('php', ['watch', 'connectphp']);
gulp.task('serve', ['watch', 'connect']);
gulp.task('default', ['watch']);

// errors

function errorHandler(error) {
	console.log(error.toString());
	this.emit('end');
}
