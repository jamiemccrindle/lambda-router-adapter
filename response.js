'use strict';

var util = require('util');
var streams = require('memory-streams');

/**
 * An in memory HTTP Response that captures any data written to it
 * so that it can be easily serialised into a lambda payload
 *
 * @callback done called when end is called on this response
 *
 * @class
 * @param done
 * @constructor
 */
function LambdaHttpResponse(done) {
  streams.WritableStream.call(this);
  this.done = done;
  this.headers = {};
  this.headersSet = false;
  this.statusCode = 200;
  this.statusMessage = undefined;
}

util.inherits(LambdaHttpResponse, streams.WritableStream);

LambdaHttpResponse.prototype.setTimeout = function(msecs, callback) {}
LambdaHttpResponse.prototype.destroy = function(error) {}
LambdaHttpResponse.prototype.setHeader = function(name, value) {
  this.headers[name] = value;
}
LambdaHttpResponse.prototype.getHeader = function(name) {
  return this.headers[name];
}
LambdaHttpResponse.prototype.removeHeader = function(name) {
  delete this.headers[name]
}
LambdaHttpResponse.prototype.flushHeaders = function() {}
LambdaHttpResponse.prototype.writeHead = function(statusCode, reason, obj) {
  if (typeof reason === 'string') {
    // writeHead(statusCode, reasonPhrase[, headers])
    this.statusMessage = reason;
  } else {
    // writeHead(statusCode[, headers])
    this.statusMessage =
      this.statusMessage || '';
    obj = reason;
  }
  this.statusCode = statusCode;
  if (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k) this.setHeader(k, obj[k]);
    }
  }
}
LambdaHttpResponse.prototype.end = function(data, encoding, callback) {
  LambdaHttpResponse.super_.prototype.end.apply(this, arguments);
  if(this.done) {
    this.done(this);
  }
}

/**
 * @callback done called when end is called on this response
 * @param done
 * @returns {LambdaHttpResponse}
 */
function newResponse(done) {
  return new LambdaHttpResponse(done);
}

/**
 * Serialises a LambdaHttpResponse
 * @param {LambdaHttpResponse} httpResponse
 * @returns {{headers: Object.<string, string>, statusCode: number, bodyBase64: string}}
 */
function convert(httpResponse) {
  var lambdaResponse = {
    headers: httpResponse.headers,
    statusCode: httpResponse.statusCode,
    bodyBase64: httpResponse.toBuffer().toString('base64')
  };
  if(httpResponse.statusMessage) {
    lambdaResponse.statusMessage = httpResponse.statusMessage;
  }
  return lambdaResponse;
}

module.exports = {
  newResponse: newResponse,
  LambdaHttpResponse: LambdaHttpResponse,
  convert: convert
}