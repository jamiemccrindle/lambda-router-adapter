var request = require('./request');
var response = require('./response');

/**
 * This callback is displayed as part of the Requester class.
 * @callback httpCallback
 * @param {object} req an http request
 * @param {object} res an http response
 */

/**
 * @param {httpCallback} callback
 * @returns {Function}
 */
function newExpressHandler(app, callbackWaitsForEmptyEventLoop) {
  app.request.__proto__.__proto__ = request.LambdaHttpRequest.prototype;
  app.response.__proto__.__proto__ = response.LambdaHttpResponse.prototype;
  return function(event, context, callback) {
    if (typeof callback != 'undefined' && typeof callbackWaitsForEmptyEventLoop == 'undefined') {
      // The callback is defined -> we're running in the new Node.js runtime,
      // and callbackWaitsForEmptyEventLoop is not explicitly defined -> we should apply the transition pattern:
      // http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-using-old-runtime.html#transition-to-new-nodejs-runtime 
      context.callbackWaitsForEmptyEventLoop = false;
    }
    else if (typeof callbackWaitsForEmptyEventLoop != 'undefined') {
      // The user code passed callbackWaitsForEmptyEventLoop -> apply this value.
      context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop;
    }
    var lambdaHttpRequest = request.convert(event);
    var lambdaHttpResponse = response.newResponse(function(lambdaHttpResponse) {
      (callback || context.done)(null, response.convert(lambdaHttpResponse));
    });
    app.handle(lambdaHttpRequest, lambdaHttpResponse, function(error) {
      if(error) {
        (callback || context.done)(error);
      }
    });
  }
}

module.exports = {
  convertRequest: request.convert,
  convertResponse: response.convert,
  newResponse: response.newResponse,
  newExpressHandler: newExpressHandler
}
