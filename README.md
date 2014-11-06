grunt-dry: reusable grunt task configuration for modules
========================================================

This is a simple package that pulls in a lot of boilerplate grunt logic for a
reusable javascript module.

Installation
============

`npm install --save-dev grunt grunt-dry`

Create a gruntfile.js containing

```
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.task.loadNpmTasks('grunt-dry');
});
```

Usage
=====

Once loaded, the module will provide the following high-level grunt tasks:

**grunt build**

Uses browserify to generate browser/<module_name>.js including a source map
extracted into browser/<module_name>.js.map

**grunt test**

Runs unit tests using mocha from `specs/**/*.js`, both in the server and in
the browser using the bundled result, loaded using require.js.

Options
=======
