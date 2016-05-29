import gulp from 'gulp';
import babel from 'gulp-babel';

const paths = {
    scripts: ['src/**/*.js', 'src/*.js'],
    build: 'lib/'
};

gulp.task('build', () => {
    return gulp.src(paths.scripts)
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
