# lambda-router-adapter

Adapts Lambda Router Requests and Responses to NodeJS HTTP Request and Responses.
This is a utility library for implementing AWS Lambda functions that receive
events from the
[github.com/jamiemccrindle/lambda-router](http://github.com/jamiemccrindle/lambda-router)
project.

## Usage

### Express 4.x

lambda-router-adapter has built in support for express 4.x.
Use the newExpressHandler method to convert an express app into a lambda
handler.

    var express = require('express');
    var adapter =require('lambda-router-adapter');
    var app = express();

    app.get('/', function(req, res) {
        res.send('Hello World');
    });

    module.exports.handler = adapter.newExpressHandler(app);

### Generic

#### convertRequest

Convert a lambda event into a LambdaHttpRequest, which has the same interface
 as a NodeJS http request.

The lambda event must have the following fields:

* url
* method

The lambda event could have the following fields:

* body
* headers

#### newResponse

Create a new LambdaHttpResponse which has the same interface as a NodeJS http
response.

#### convertResponse

Serialise the LambdaHttpResponse into an object that can be sent as a lambda
response.

The response will have the following fields:

* statusCode
* statusMessage
* headers
* body or bodyBase64