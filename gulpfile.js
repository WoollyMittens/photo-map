// project

var project = __dirname.split('/').pop();

// dependencies

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  special = require('gulp-special-html'),
  clean = require('gulp-clean');

// externalities

gulp.task('import', function () {
  gulp.src('../useful-polyfills/src/js/*.js', {base: '../useful-polyfills/src/js/'})
    .pipe(gulp.dest('src/lib/'));
  gulp.src('../useful-gestures/src/js/*.js', {base: '../useful-gestures/src/js/'})
    .pipe(gulp.dest('src/lib/'));
});

// server

gulp.task('connect', function() {
  connect.server({
    port: 8500,
    root: 'dist/',
    livereload: {port: 35939}
  });
});

// dynamic reload

gulp.task('html', function () {
  gulp.src('dist/*.html')
    .pipe(connect.reload());
});

gulp.task('css', function () {
  gulp.src('dist/css/*.css')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('dist/js/*.js')
    .pipe(connect.reload());
});

// pre-process

gulp.task('clean', function() {
	return gulp.src('dist/*', {read: false})
		.pipe(clean());
});

gulp.task('markup', function () {
  gulp.src(['src/*.html', 'src/*.php'])
    .pipe(special())
    .pipe(gulp.dest('dist/'));
  gulp.src('src/html/**/*.html')
    .pipe(special())
    .pipe(gulp.dest('dist/html/'));
  gulp.src('src/php/**/*.php')
    .pipe(special())
    .pipe(gulp.dest('dist/php/'));
  gulp.src('src/json/**/*.js')
    .pipe(special())
    .pipe(gulp.dest('dist/json/'));
});

gulp.task('assets', function () {
  gulp.src('src/xml/*.xml')
    .pipe(gulp.dest('dist/xml/'));
  gulp.src('src/tiles/**/*.*')
    .pipe(gulp.dest('dist/tiles/'));
  gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('images', function () {
  gulp.src(['src/img/**/*.gif', 'src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg'])
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: true}],
        use: [pngquant()]
    }))
    .on('error', errorHandler)
    .pipe(gulp.dest('dist/img'));
});

gulp.task('styles:dev', function () {
  gulp.src('src/scss/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('styles:dist', function () {
  gulp.src('src/scss/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('scripts:dev', function() {
  gulp.src(['src/lib/**/*.js', 'src/js/**/*.js'])
    .pipe(concat(project + '.js'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts:dist', function() {
  gulp.src(['src/lib/**/*.js', 'src/js/**/*.js'])
    .pipe(concat(project + '.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

// watch changes

gulp.task('watch', function () {
  gulp.watch(['./src/*.html'], ['markup']);
  gulp.watch(['./src/scss/*.scss'], ['styles:dev']);
  gulp.watch(['./src/js/*.js'], ['scripts:dev']);
  gulp.watch(['./dist/*.html'], ['html']);
  gulp.watch(['./dist/css/*.css'], ['css']);
  gulp.watch(['./dist/js/*.js'], ['js']);
});

// tasks

gulp.task('dist', ['import', 'markup', 'assets', 'images', 'styles:dist', 'scripts:dist']);
gulp.task('dev', ['import', 'markup', 'assets', 'images', 'styles:dev', 'scripts:dev']);
gulp.task('default', ['watch', 'connect']);

// errors
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}












// EOF
