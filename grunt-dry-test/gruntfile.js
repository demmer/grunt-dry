var path = require('path');
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('./package.json');
    pkg.grunt_dry_root = path.join(__dirname, '..');

    grunt.initConfig({
        pkg: pkg
    });

    grunt.task.loadTasks('../tasks');
};
