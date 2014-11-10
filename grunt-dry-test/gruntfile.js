var path = require('path');
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        gruntDry: {
            pkg: pkg,
            root: path.join(__dirname, '..'),
            deps: {
                'underscore': {
                    browserBuild: 'node_modules/underscore/underscore.js'
                },
                'chai': {
                    browserBuild: 'node_modules/chai/chai.js',
                    testOnly: true
                }
            }
        }
    });

    grunt.task.loadTasks('../tasks');
};
