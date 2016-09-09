var gulp = require('gulp');
var typescript = require('gulp-typescript');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var config = {
	sourceDir: './src/',
	distDir: './dist/'
}

gulp.task('typescript', function () {
    gulp.src(config.sourceDir + 'ts/*.ts')
        .pipe(typescript())
        .js
        .pipe(gulp.dest(config.distDir + 'scripts/'));
});

gulp.task('sass', function() {
    gulp.src(config.sourceDir + 'scss/*.scss')
        .pipe(sass(/*{outputStyle: 'compressed'}*/))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.distDir + 'styles/'))
});

gulp.task('watch', function() {
    gulp.watch(config.sourceDir + 'scss/*.scss', ['sass']);
    gulp.watch(config.sourceDir + 'ts/*.ts', ['typescript']);
});

gulp.task('default', ['typescript', 'sass'], function() { });