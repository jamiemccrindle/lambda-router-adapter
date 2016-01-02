'use strict';

var url = require('url');
var util = require('util');
var streams = require('memory-streams');

function convert(lambdaRequest) {

  var httpRequest = new streams.ReadableStream(lambdaRequest.body);

  httpRequest.httpVersionMajor = 1;
  httpRequest.httpVersionMinor = 1;
  httpRequest.httpVersion = 1.1;
  httpRequest.complete = false;
  httpRequest.trailers = {};
  httpRequest.readable = true;

  httpRequest.method = lambdaRequest.method;
  httpRequest.url = lambdaRequest.url;
  httpRequest.originalUrl = lambdaRequest.url;
  httpRequest.path = url.parse(lambdaRequest.url).pathname;

  httpRequest.headers = lambdaRequest.headers;
  httpRequest.body = lambdaRequest.body;

  httpRequest.setTimeout = function(msecs, callback) { }
  httpRequest.destroy = function() { }

  return httpRequest;

}

module.exports.convert = convert;