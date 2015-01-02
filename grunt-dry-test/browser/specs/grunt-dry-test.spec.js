(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            'underscore',
            'chai',
            'grunt-dry-test'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('chai'), require('grunt-dry-test'));
    } else {
        // Browser globals
        this.grunt_dry_test_specs = factory(underscore, chai, gruntdrytest);
    }
}(function (__external_underscore, __external_chai, __external_gruntdrytest) {
    var global = this, define;
    function _require(id) {
        var module = _require.cache[id];
        if (!module) {
            var exports = {};
            module = _require.cache[id] = {
                id: id,
                exports: exports
            };
            _require.modules[id].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            module.exports = __external_chai;
        },
        function (module, exports) {
            module.exports = __external_gruntdrytest;
        },
        function (module, exports) {
            module.exports = __external_underscore;
        },
        function (module, exports) {
            var expect = _require(0).expect;
            var _ = _require(2);
            var module = _require(1);
            describe('grunt-dry-test', function () {
                it('exported a bunch of functions', function () {
                    expect(typeof module.helper).equal('function');
                    expect(typeof module.helper2).equal('function');
                    expect(typeof module.helper3).equal('function');
                    expect(_.isFunction(module.helper)).equal(true);
                    expect(_.isFunction(module.helper2)).equal(true);
                    expect(_.isFunction(module.helper3)).equal(true);
                });
                it('exported the expected functions', function () {
                    expect(module.helper()).equal('helper');
                    expect(module.helper2()).equal('helper2');
                    expect(module.helper3()).equal('helper3');
                });
            });
        }
    ];
    return _require(3);
}));