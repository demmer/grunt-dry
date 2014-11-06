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
    Object.keys(dry_pkg.dependencies).forEach(function(pkg) {
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
        },
        specs: {
            options: {
                browserifyOptions: {
                    bundleExternal: true
                }
            },
            src: ['specs/**/*.js'],
            dest: 'browser/specs/' + pkg.name + '.spec.js'
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

    var mochaHtml = 'browser/specs/index.html';
    grunt.config.set('mocha', {
        options: {
            log: true,
            reporter: 'Spec',
            ui: 'bdd',
            run: false,
            ignoreLeaks: false,
            globals: ['should']
        },
        all: {
            src: [mochaHtml]
        }
    });

    grunt.registerTask('mochaPrep', 'generate specs/browser/index.html for testing', function() {
        var src = grunt.file.read('node_modules/grunt-dry/test/index.html.tmpl');
        var dst = mochaHtml;
        grunt.file.write(dst, grunt.template.process(src, {data: {
            mocha: '../../node_modules/grunt-dry/node_modules/mocha',
            'grunt_mocha': '../../node_modules/grunt-dry/node_modules/grunt-mocha',
            pkg: pkg
        }}));
    });

    grunt.registerTask('build', [
        'browserify',
        'exorcise',
        'mochaPrep'
    ]);

    grunt.registerTask('test', [
        'mochaTest',
        'mocha'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};
