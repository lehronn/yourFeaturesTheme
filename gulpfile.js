var gulp = require('gulp');
var gutil = require("gulp-util");
var del = require('del');
var pug = require('gulp-pug');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-csso');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var eslintConfig = require('eslint-config-gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');

var dev = 'dev', dist = 'dist';

gulp.task('clean', function () {
  return del([dist]);
});

gulp.task('html', function(){
  return gulp.src(dev + '/html/index.pug')
    .pipe(sourcemaps.init()) //
    .pipe(pug())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(sourcemaps.write('.')) //
    .pipe(gulp.dest(dist))
});

gulp.task('css', function(){
  return gulp.src(dev + '/styles/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(autoprefixer({
      browsers: ['Last 5 versions'], //for last 5 version = 93,12% coverage
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + '/styles'))
});

gulp.task('js', () =>
  gulp.src(dev + '/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(babel({
      presets: ['env']
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(concat('boundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + '/scripts'))
);

gulp.task('imagemin', function(){
  return gulp.src(dev + '/images/*')
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest(dist + '/images'));
});

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['clean', 'html', 'css', 'js', 'imagemin']);

gulp.task('watch', function(){
  gulp.watch(dev + '/html/*.pug', ['html']);
  gulp.watch(dev + '/styles/*.sass', ['css']);
  gulp.watch(dev + '/scripts/*.js', ['js']);
  gulp.watch(dev + '/images/*', ['imagemin']);
})
