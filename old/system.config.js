(function (global) {
    'use strict';

    var paths = {
            // paths serve as alias
            'npm:': './node_modules/'
        },
        map = {
            'app': 'app',
            'rxjs': 'lib/js/rxjs',
            '@angular': 'lib/js/@angular',
            'zone.js': 'lib/js/zone.js/dist',
        },
        packages = {
            'app': {
                main: 'main.js'
            },
            'rxjs': {
                defaultExtension: 'js'
            },
            'zone.js': {
                main: 'zone',
                defaultExtension: 'js'
            }
            /*,
            'web-animations-js': {
                main: 'web-animations-js.min.js'
            }
            */
        },
        packageNames = [
            '@angular/common',
            '@angular/compiler',
            '@angular/core',
            '@angular/forms',
            '@angular/http',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/router'
        ];

    packageNames.forEach(function (pkgName) {
        packages[pkgName] = {
            main: 'index.js',
            defaultExtension: 'js'
        };
    });

    System.config({
        paths: paths,
        map: map,
        packages: packages
    });
})(this);
