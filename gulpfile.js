'use strict';

var es = require('event-stream');
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');

var path = {
    sass: {
        src: 'assets/sass/**/*.scss',
        dest: 'assets/css/'
    },
    js: {
        modules: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'dist/vendor/typedjs/js/typed.js'
        ]
    },
    css: {
        modules: [
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/animate.css/animate.css',
            /**
             * To font-awesome work we need add the folder fonts to assets
             */
            'dist/vendor/font-awesome-4.7.0/css/font-awesome.css'
        ]
    },
    vendor: 'dist/vendor/'
};

gulp.task('sources', function () {
    return gulp.src(path.sources)
        .pipe(flatten({includeParents: [1, 1]}))
        .pipe(gulp.dest(path.vendor));
});

gulp.task('js-modules', function () {
    return gulp.src(path.js.modules)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(path.vendor));
});

gulp.task('css-modules', function () {
    var sassStream = gulp.src(path.sass.src);
    var vendorStream = gulp.src(path.css.modules);

    return es.merge(vendorStream, sassStream)
        .pipe(concat('all.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.sass.dest));
});

gulp.task('watch', function () {
    gulp.watch(path.sass.src, ['css-modules']);
});

gulp.task('build', ['watch', 'css-modules', 'js-modules']);