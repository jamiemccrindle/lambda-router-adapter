'use strict';

var util = require('util');
var streams = require('memory-streams');

function newResponse() {

  var httpResponse = new streams.WritableStream();

  httpResponse.headers = {};
  httpResponse.headersSet = false;
  httpResponse.statusCode = 200;
  httpResponse.statusMessage = undefined;
  httpResponse.setTimeout = function setTimeout(msecs, callback) {}
  httpResponse.destroy = function destroy(error) {}
  httpResponse.setHeader = function(name, value) {
    httpResponse.headers[name] = value;
  }
  httpResponse.getHeader = function(name) {
    return httpResponse.headers[name];
  }
  httpResponse.removeHeader = function(name) {
    delete httpResponse.headers[name];
  }
  httpResponse.flushHeaders = function() { }
  httpResponse.writeHead = function(statusCode, reason, obj) {
    if (typeof reason === 'string') {
      // writeHead(statusCode, reasonPhrase[, headers])
      this.statusMessage = reason;
    } else {
      // writeHead(statusCode[, headers])
      this.statusMessage =
        this.statusMessage || STATUS_CODES[statusCode] || 'unknown';
      obj = reason;
    }
    this.statusCode = statusCode;
    if (obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k) httpResponse.setHeader(k, obj[k]);
      }
    }
  }
  return httpResponse;
}

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
  convert: convert
}