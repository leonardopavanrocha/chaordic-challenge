var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var minify = require('gulp-minify');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

var devFolder = './dev/';

gulp.task('styles', function () {
  return gulp.src(devFolder + 'sass/*.scss')
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
      ]
    }))
    .pipe(csso())
    .pipe(gulp.dest('./'))
});

gulp.task('scripts', function() {
  gulp.src(devFolder + 'js/*.js')
    .pipe(minify({
        ext:{
            min:'.js'
        },
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('pages', function () {
  return gulp.src([devFolder + '**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('clean', () => del(['script.js', './*.css', './*.html']));

gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'pages',
    'scripts',
  );
});