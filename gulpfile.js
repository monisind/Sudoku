'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('serve', ['browserSync'], function() {
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
    gulp.watch('app/**/*.css', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
});