# grunt-dry: reusable grunt task configuration for modules

This is a simple package that pulls in a lot of boilerplate grunt logic for a reusable javascript module.

## Getting Started

Install grunt and grunt-dry using NPM:

`npm install --save-dev grunt grunt-dry`

Then create a gruntfile.js containing:

```
module.exports = function(grunt) {
    grunt.initConfig({
        gruntDry: {
            pkg: grunt.file.readJSON('package.json');
        }
    });

    grunt.task.loadNpmTasks('grunt-dry');
});
```

Then run the following grunt tasks:

**grunt build**

Uses [grunt-pure-cjs](https://github.com/RReverser/grunt-pure-cjs) to generate browser/<module_name>.js and browser/specs/*.spec.js by bundling the commonjs files into a single file for both the module itself and any mocha spec files.

Each file is generated using a umd wrapper so it can be loaded through a variety of front-end module systems.

**grunt test**

Runs unit tests using server-side mocha in node.js from `specs/*.js` and in browser using `browser/specs/*.js.

All tests are loaded using requirejs.

## Managing Dependencies

If the module and/or the tests requires external dependencies, they should be included in the `deps` option of the grunt config. Each entry should contain a path to the browser build of the module as well as an optional flag to indicate if it is test-only.

For example the following configuration would indicate that the library depends on `underscore` and the tests also depend on `chai`:

    deps: {
        'underscore': {
            browserBuild: 'node_modules/underscore/underscore.js'
        },
        'chai': {
            browserBuild: 'node_modules/chai/chai.js',
            testOnly: true
        }
    }

See [grunt-dry-test/gruntfile.js](./grunt-dry-test/gruntfile.js) for a complete working example.

## Options

The configuration supports the following options:

 * *pkg*: (required) package.json contents
 * *root*: Specifies the location of the grunt-dry task. The default is `node_modules/grunt-dry`.
 * *sourceMap*: If true, then the package will generate a source map when building the browser bundle.
