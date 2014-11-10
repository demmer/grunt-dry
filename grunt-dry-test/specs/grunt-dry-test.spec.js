var expect = require('chai').expect;
var _ = require('underscore');

var module = require('grunt-dry-test');

describe('grunt-dry-test', function() {
    it('exported a bunch of functions', function() {
        expect(typeof module.helper).equal('function');
        expect(typeof module.helper2).equal('function');
        expect(typeof module.helper3).equal('function');

        expect(_.isFunction(module.helper)).equal(true);
        expect(_.isFunction(module.helper2)).equal(true);
        expect(_.isFunction(module.helper3)).equal(true);
    });

    it('exported the expected functions', function() {
        expect(module.helper()).equal('helper');
        expect(module.helper2()).equal('helper2');
        expect(module.helper3()).equal('helper3');
    });
});
