function convertRequest(request) {
  var result = {
    method: request.method,
    headers: request.headers,
    body: request.body,
    url: request.url,
    path: request.path,
    protocol: request.protocol
  }
  return result;
}

function convertResponse(response) {
  var result = {
    headers: response.headers,
    body: response.body,
    statusCode: response.statusCode
  }
  return result;
}

module.exports = {
  convertRequest: convertRequest,
  convertResponse: convertResponse
}