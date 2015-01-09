var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = function(grunt) {
    grunt.option('stack', true);

    var config = grunt.config.get('gruntDry');
    if (!config || !config.pkg) {
        throw new Error('package.json must be loaded into grunt.config[gruntDry].pkg');
    }

    var pkg = config.pkg;
    var root = config.root || 'node_modules/grunt-dry/';
    var main = pkg.main;
    var browserBuild = 'browser/' + pkg.name + '.js';
    var sourcemap = browserBuild + '.map';

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


    // Build a map of external dependencies that are excluded from the browser
    // build and/or test builds.
    var externals = {};
    var testExternals = {};
    _.each(config.deps, function(info, name) {
        testExternals[name] = true;
        if (! info.testOnly) {
            externals[name] = true;
        }
    });

    testExternals[pkg.name] = true;

    // Build the pure_cjs configuration for the module itself and all spec
    // files.
    var pure_cjs_cfg = {
        module: {
            options: {
                exports: pkg.name.replace(/-/g, '_'),
                external: externals,
                comments: true,
                map: true
            },

            src: main,
            dest: browserBuild
        }
    };

    _.each(grunt.file.expand('specs/**/*.js'), function(spec) {
        var key = spec.replace(/[/\.]/g, '_');
        var dest = 'browser/' + spec;
        pure_cjs_cfg[key] = {
            options: {
                exports: pkg.name.replace(/-/g, '_') + '_specs',
                external: testExternals,
                comments: true
            },

            src: spec,
            dest: dest
        };
    });
    grunt.config.set('pure_cjs', pure_cjs_cfg);

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

    grunt.registerTask('mocha_prep', 'generate specs/browser/index.html for testing', function() {
        var src = grunt.file.read(root + '/test/index.html.tmpl');
        var dst = mochaHtml;

        var module_path = path.relative(path.dirname(dst),
                                        path.join(process.cwd(), 'node_modules'));

        var require_paths = {};
        require_paths[pkg.name] = '../' + pkg.name;

        // When building the requirejs paths, check for <dependency>.js inside
        // the node_modules directory.
        _.each(config.deps, function(info, dep) {
            if (! fs.existsSync(info.browserBuild)) {
                throw new Error(dep + ' browser build ' + info.browserBuild + ' does not exist');
            }

            require_paths[dep] = path.relative(
                path.dirname(dst),
                info.browserBuild.replace(/.js$/, ''));
        });

        grunt.file.write(dst, grunt.template.process(src, {data: {
            modules: path.relative(path.dirname(dst),
                                   path.join(root, 'node_modules')),
            pkg: pkg,
            require_paths: JSON.stringify(require_paths, null, 4),
            specs: JSON.stringify(grunt.file.expand({cwd: 'specs'}, '*.js'))
        }}));
    });

    grunt.registerTask('module_symlink', 'create node_modules symlink for the module', function() {
        var link = path.join('node_modules', pkg.name);
        try {
            fs.unlinkSync(link);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        fs.symlinkSync('..', link);
    });

    grunt.registerTask('build', [
        'module_symlink',
        'pure_cjs',
        'mocha_prep'
    ]);

    grunt.registerTask('test', [
        'build',
        'mochaTest',
        'mocha'
    ]);

    grunt.registerTask('default', 'test');
};
