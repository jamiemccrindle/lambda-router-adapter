'use strict';

var url = require('url');
var util = require('util');
var streams = require('memory-streams');

function LambdaSocket() {

}
LambdaSocket.prototype.destroy = function() {}

/**
 * Converts a Lambda Event to a NodeJS Http Request.
 *
 * @param {{ body: string, method: string, headers: Object.<string,string>, url: string}} lambdaRequest
 * @constructor
 */
function LambdaHttpRequest(lambdaRequest) {
  streams.ReadableStream.call(this, lambdaRequest.body);
  this.httpVersionMajor = 1;
  this.httpVersionMinor = 1;
  this.httpVersion = 1.1;
  this.complete = false;
  this.trailers = {};
  this.readable = true;

  this.method = lambdaRequest.method;
  this.url = lambdaRequest.url;
  this.originalUrl = lambdaRequest.url;
  this.path = url.parse(lambdaRequest.url).pathname;

  this.headers = lambdaRequest.headers || {};
  this.body = lambdaRequest.body;
  this.socket = new LambdaSocket();
}

LambdaHttpRequest.prototype.setTimeout = function(msecs, callback) { }
LambdaHttpRequest.prototype.done = function(error) { }

util.inherits(LambdaHttpRequest, streams.ReadableStream);

function convert(lambdaRequest) {
  return new LambdaHttpRequest(lambdaRequest);
}

module.exports = {
  convert: convert,
  LambdaHttpRequest: LambdaHttpRequest
}