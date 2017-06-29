'use strict';

const del = require('del');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const colors = require('colors');
const concat = require('gulp-concat');
const liveServer = require('gulp-live-server');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const sysBuilder = require('systemjs-builder');
const tslint = require('gulp-tslint');
const tsc = require('gulp-typescript');
const uglify = require('gulp-uglify');
const tsconfig = require('tsconfig-glob');

const tscConfig = require('./tsconfig.json');
const testTscConfig = require('./tests/tsconfig.json');

const embedTemplates = require ('gulp-angular-embed-templates');

tscConfig.compilerOptions['typescript'] = require('typescript');

// Clean the js distribution directory
gulp.task('clean:app:js', function () {
    return del('dist/app/**/*.js');
});


gulp.task('clean:assets', function () {
    return del('dist/assets/**/*');
});

gulp.task('clean:html', function () {
    return del('dist/**/*.html');
});

// Clean the css distribution directory
gulp.task('clean:app:css', function () {
    return del('dist/**/*.css');
});

// Clean library directory
gulp.task('clean:lib', function () {
    return del('dist/lib/**/*');
});

// Clean test build directory
gulp.task('clean:tests', function () {
    return del('tests/js/**/*');
});

// Lint Typescript
gulp.task('lint:ts', function () {
    return gulp.src('app/**/*.ts')
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report({
            emitError: false
        }));
});

// Compile TypeScript to JS
gulp.task('compile:ts', function () {
    return gulp
        .src(tscConfig.filesGlob)
        .pipe(embedTemplates({sourceType:'ts'}))
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [tsc] Typescript compilation failed'.bold.green);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(tsc(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app'));
});

// Generate systemjs-based builds
gulp.task('bundle:js', function () {
    var builder = new sysBuilder('dist', './system.config.js');
    return builder.buildStatic('app', 'dist/app/app.min.js', {
            minify: false,
            sourceMaps: true
        })
        .then(function () {
            //            return del(['dist/app/**/*.js', 'dist/app/**/*.map','!dist/app/app.min.*']);
        })
        .catch(function (err) {
            console.error('>>> [systemjs-builder] Bundling failed'.bold.red, err);
        });
});

// Minify JS bundle
gulp.task('minify:js', function () {
    return gulp
        .src('dist/app/app.min.js')
        //        .pipe(uglify())
        .pipe(gulp.dest('dist/app'));
});

// Lint Sass
gulp.task('lint:sass', function () {
    return gulp.src('styles/**/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [sass-lint] Sass linting failed'.bold.green);
                this.emit('end');
            }
        }))
        .pipe(sassLint({
            options: {
                formatter: 'stylish',
                'merge-default-rules': false
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

// Compile SCSS to CSS, concatenate, and minify
gulp.task('compile:sass', function () {
    // concat and minify global scss files
    return gulp
        .src([
          'styles/*.scss',
          'app/**/*.scss'
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [sass] Sass global style compilation failed'.bold.green, err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
    // minify component specific scss files
});

// Concat and minify CSS
gulp.task('minify:css', function () {
    // minify component css files
    gulp.src('app/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

// Copy dependencies
gulp.task('copy:libs', function () {
    gulp.src(['node_modules/rxjs/**/*'])
        .pipe(gulp.dest('dist/lib/js/rxjs'));

    gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
            'node_modules/core-js/client/shim.min.js',
            // 'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/es6-promise/dist/es6-promise.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js',
            // 'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'system.config.js'
        ])
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib/js'));

    gulp.src([
            // 'node_modules/es6-shim/es6-shim.map',
            'node_modules/reflect-metadata/Reflect.js.map',
            // 'node_modules/systemjs/dist/system-polyfills.js.map'
        ])
        .pipe(gulp.dest('dist/lib/js'));

    /* copy fonts */
    gulp.src('node_modules/bootstrap-sass/assets/fonts/**/*')
        .pipe(gulp.dest('dist/lib/fonts'));

    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/lib/fonts/font-awesome/'));

    return gulp.src('node_modules/@angular/**/*')
        .pipe(gulp.dest('dist/lib/js/@angular'));
});

function getAppVersion() {
    return Date.now();
}

gulp.task('copy:html', function () {
    return gulp.src('app/index.html')
        .pipe(replace('{appVersion}', getAppVersion()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:assets', function () {
    return gulp.src([
            'assets/**/*'
        ])
        .pipe(gulp.dest('dist/assets'));
});

// Update the tsconfig files based on the glob pattern
gulp.task('tsconfig-glob', function () {
    return tsconfig({
        configPath: '.',
        indent: 2
    });
});

// Watch src files for changes, then trigger recompilation
gulp.task('watch:src', function () {
    gulp.watch(['app/**/*.ts', 'app/**/*.html'], runAndReload('scripts', 500));

    gulp.watch(['app/index.html'], runAndReload('copy:html', 100));

    gulp.watch('assets/**/*', runAndReload('copy:assets'));

    gulp.watch(['styles/**/*.scss', 'app/**/*.scss', 'app/**/*.css'], runAndReload('styles', 1500));
});

let server;
// Run Express, auto rebuild and restart on src changes
gulp.task('serve', ['watch:src'], function () {
    server = liveServer.static('dist', 8081);
    server.start();
});

// Run tasks sequence then reload browser
function runAndReload() {
    let tasks = Array.prototype.slice.call(arguments, 0);
    let delay = 0;
    if (typeof tasks[tasks.length - 1] === 'number') {
        delay = tasks[tasks.length - 1];
        tasks.splice(tasks.length - 1);
    }
    let tasksId = tasks.join('+');
    let tasksIndex;
    return function () {
        tasksIndex = runAndReload.tasks.indexOf(tasksId);
        if (tasksIndex >= 0) {
            return; // task already running
        }
        runAndReload.tasks.push(tasksId);
        runSequence.apply(this, tasks.concat([function () {
            setTimeout(function () {
                if (runAndReload.tasks.length === 1) { // no other tasks running
                    console.log('======================= reload ======================='.bold.gray);
                    console.log('');
                    server.notify.apply(server, [{
                        path: __dirname + '/dist/index.html'
                    }]);
                }
                tasksIndex = runAndReload.tasks.indexOf(tasksId);
                runAndReload.tasks.splice(tasksIndex, 1);
            }, delay);
        }]));
    };
}
runAndReload.tasks = [];

// Compile .ts files unbundled for tests
gulp.task('compile:specs', function () {
    return gulp
        .src([
            "app/**/*.ts",
            "app/typings/*.d.ts"
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.error('>>> [tsc] Typescript tests compilation failed'.bold.green);
                this.emit('end');
            }
        }))
        .pipe(tsc(testTscConfig.compilerOptions))
        .pipe(gulp.dest('tests'));
});

gulp.task('test', ['compile:specs'], function () {
    gulp.watch('app/**/*.ts', ['compile:specs']);
});

gulp.task('lint', ['lint:ts', 'lint:sass']);

gulp.task('clean', [
    'clean:app:js',
    'clean:app:css',
    'clean:lib',
    'clean:tests',
    'clean:html',
    'clean:assets'
]);

gulp.task('copy', function (callback) {
    runSequence('clean:lib', 'copy:libs', 'clean:html', 'copy:html', 'clean:assets', 'copy:assets',
        callback);
});
gulp.task('scripts', function (callback) {
    runSequence(['lint:ts', 'clean:app:js'], 'compile:ts', 'bundle:js', 'minify:js', callback);
});
gulp.task('styles', function (callback) {
    runSequence(['lint:sass', 'clean:app:css'], ['compile:sass', 'minify:css'], callback);
});
gulp.task('build', function (callback) {
    runSequence('copy', 'scripts', 'styles', callback);
});

gulp.task('assets', function (cb) {
    runSequence('clean:assets', 'copy:assets');
});

gulp.task('default', function (callback) {
    runSequence('build', 'serve', callback);
});
