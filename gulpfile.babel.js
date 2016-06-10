import gulp from 'gulp';
import babel from 'gulp-babel';
import cache from 'gulp-cached';

const paths = {
    scripts: ['src/**/*.js', 'src/*.js'],
    build: 'lib/'
};

gulp.task('build', () => {
    return gulp.src(paths.scripts)
        .pipe(cache('build'))
        .pipe(babel())
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(gulp.dest(paths.build));
});

gulp.task('watch', () => {
    gulp.watch(paths.scripts, ['build']);
});
