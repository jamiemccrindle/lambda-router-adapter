var assert = require('assert');
describe('LambdaRouterAdapter', function() {
  describe('index', function () {
    it('should compile', function () {
      require('../');
    });
    it('should end', function (done) {
      var index = require('../');
      index.newHandler(function(req, res) {
        res.end();
        done();
      })({url: '/test'}, {done: function() {}});
    });
  });
  describe('request', function () {
    it('should compile', function () {
      require('../request');
    });
  });
  describe('response', function () {
    it('should compile', function () {
      require('../response');
    });
  });
});
