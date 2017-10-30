require('es6-promise').polyfill();

var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    csswring = require('csswring'),
    lost = require('lost'),
    cp = require('child_process'),
    browserSync = require('browser-sync'),
    jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll',
    messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */

gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function(){
   var processors = [
         csswring,
         lost,
         autoprefixer({
             browsers: ['last 9 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
         })
    ];
  return gulp.src('css/main.scss') // Get all the files ending with scss
        .pipe(sass({
            includePaths: ['_scss'],
            onError: browserSync.notify
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.stream())
        // .pipe(notify({message: 'sass task successffully done'}))
});


gulp.task('scripts', function(){
    return gulp.src('js/app.js')
    // .pipe(uglify())
    // .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('_site/js'))
    .pipe(browserSync.stream())
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_scss/**/*.scss', 'css/**/*.scss'], ['sass']);
    gulp.watch('js/**/*js', ['scripts']);
    gulp.watch(['./**/*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'], ['jekyll-rebuild']);
});


// Default task
gulp.task('default', ['browser-sync', 'watch']);
