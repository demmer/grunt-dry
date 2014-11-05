var path = require('path');

module.exports = function(grunt) {
    grunt.option('stack', true);

    var pkg = grunt.config.get('pkg');
    if (! pkg) {
        throw new Error('package.json must be loaded into grunt.config[pkg]');
    }

    // Can't use grunt.loadNpmTasks here because it uses the
    // parent project's package.json file.
    //
    // Instead load all tasks from grunt-* packages in the
    // devDependencies.
    var dry_pkg = grunt.file.readJSON(path.join(__dirname, '../package.json'));
    Object.keys(dry_pkg.devDependencies).forEach(function(pkg) {
        if (/grunt-/.test(pkg)) {
            grunt.task.loadTasks(path.join(__dirname, '../node_modules/', pkg, '/tasks'));
        }
    });

    var main = pkg.main;
    var browser = 'browser/' + pkg.name + '.js';
    var sourcemap = browser + '.map';

    grunt.config.set('browserify', {
        bundle: {
            options: {
                browserifyOptions: {
                    bundleExternal: false,
                    standalone: pkg.name,
                    debug: true
                }
            },
            src: main,
            dest: browser
        }
    });

    grunt.config.set('exorcise', {
        bundle: {
            options: {},
            files: [{
                dest: sourcemap,
                src: [browser]
            }]
        }
    });

    grunt.config.set('mochaTest', {
        options: {
            log: true,
            reporter: 'spec',
            ui: 'bdd',
            ignoreLeaks: false,
            globals: ['should']
        },
        all: {
            src: ['specs/**/*.js']
        }
    });

    grunt.registerTask('build', [
        'browserify',
        'exorcise'
    ]);

    grunt.registerTask('test', [
        'mochaTest'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};
