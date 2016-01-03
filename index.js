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
function newExpressHandler(app) {
  app.request.__proto__.__proto__ = request.LambdaHttpRequest.prototype;
  app.response.__proto__.__proto__ = response.LambdaHttpResponse.prototype;
  return function(event, context) {
    var lambdaHttpRequest = request.convert(event);
    var lambdaHttpResponse = response.newResponse(function(lambdaHttpResponse) {
      context.done(null, response.convert(lambdaHttpResponse));
    });
    app.handle(lambdaHttpRequest, lambdaHttpResponse, function(error) {
      if(error) {
        context.done(error);
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