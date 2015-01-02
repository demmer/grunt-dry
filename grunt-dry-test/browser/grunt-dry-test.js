(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'));
    } else {
        // Browser globals
        this.grunt_dry_test = factory(underscore);
    }
}(function (__external_underscore) {
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
            module.exports = _require(1);
        },
        function (module, exports) {
            module.exports = {
                helper: _require(2),
                helper2: _require(4),
                helper3: _require(3).helper3
            };
        },
        function (module, exports) {
            module.exports = function helper() {
                return 'helper';
            };
        },
        function (module, exports) {
            var _ = _require(5);
            module.exports = _.extend({}, {
                helper3: function helper3() {
                    return 'helper3';
                }
            });
        },
        function (module, exports) {
            module.exports = function helper2() {
                return 'helper2';
            };
        },
        function (module, exports) {
            module.exports = __external_underscore;
        }
    ];
    return _require(0);
}));
//# sourceMappingURL=grunt-dry-test.js.map