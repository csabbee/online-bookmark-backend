const gulp      = require('gulp');
const spawn     = require('child_process').spawn;
const _         = require('lodash');
const sequence  = require('gulp-sequence');

let backendProcess;

gulp.task('backend', (done) => {
    // This "hack" is needed because if swagger throws a yaml parse exception
    // we wont start another process otherwise
    // TODO: needs further enhancement since after an error every second "save" triggers a child process
    let timeout = setTimeout(() => {
        backendProcess = undefined;
        done();
    }, 100);

    if (!_.isUndefined(backendProcess)) {
        backendProcess.on('close', () => {
            backendProcess = startProcess();
            clearTimeout(timeout);
            done();
        });
        backendProcess.kill('SIGTERM');
    } else {
        backendProcess = startProcess();
        clearTimeout(timeout);
        done();
    }
});

gulp.task('watch:backend', () => {
    gulp.watch('api/**/*.yaml').on('change', _.debounce(startBackendTask, 1000));
    gulp.watch('api/**/*.js', ['backend']);
});

function startBackendTask() {
    return gulp.start(['backend']);
}

function startProcess() {
    return spawn('node', ['app.js',], { stdio: 'inherit' });
}

gulp.task('default', sequence(['backend', 'watch:backend']));
