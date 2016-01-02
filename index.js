var request = require('request');
var response = require('response');

module.exports = {
  convertRequest: request.convert,
  convertResponse: response.convert,
  newResponse: response.newResponse
}