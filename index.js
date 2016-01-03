var request = require('request');
var response = require('response');

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
function newHandler(callback) {
  return function(event, context) {
    var req = request.convert(event);
    var res = response.newResponse((value) => {
      context.done(null, response.convert(value));
    });
    callback(req, res);
  }
}

module.exports = {
  convertRequest: request.convert,
  convertResponse: response.convert,
  newResponse: response.newResponse,
  newHandler: newHandler
}