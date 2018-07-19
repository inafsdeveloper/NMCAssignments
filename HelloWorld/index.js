/*
 * Primary file for the API 
 * 
 * 
 */

// Dependencies 
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all the request with a string
const server = http.createServer(function(req,res){
    var data = "";

    // Get the url and parse it
    var parsedUrl = url.parse(req.url,true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    data += 'pathname - ' + path +'\n';
    data += 'trimmedPath - ' + trimmedPath +'\n';

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;
    data += 'queryStringObject - ' + JSON.stringify(queryStringObject) +'\n';
    

    // Get the HTTP method
    var method = req.method.toLowerCase();
    data += 'method - ' + method + '\n';

    // Get the header as an object
    var headers = req.headers;
    data +=  'header - ' + JSON.stringify(headers) + '\n';


    // Get the payload, if Any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();
  
        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
  
        // Construct the data object to send to the handler
        var dataObj = {
          'trimmedPath' : trimmedPath,
          'queryStringObject' : queryStringObject,
          'method' : method,
          'headers' : headers,
          'payload' : buffer
        };
  
        // Route the request to the handler specified in the router
        chosenHandler(dataObj,function(statusCode,payload){
  
          // Use the status code returned from the handler, or set the default status code to 200
          statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
  
          // Use the payload returned from the handler, or set the default payload to an empty object
          payload = typeof(payload) == 'object'? payload : {};
  
          // Convert the payload to a string
          var payloadString = JSON.stringify(payload);
  
          // Return the response
          res.setHeader('Content-Type','application/json');
          res.writeHead(statusCode);
          res.end(payloadString);
          console.log("Returning this response: ",statusCode,payloadString);
  
        });
  
    });

    // Send the response
    // res.end('Hello World\n');


    // Log the request path
    // console.log(data);
});


//  Start the server, and have it listen to a port
server.listen(3000, function(){
    console.log('The server is listening on port 3000 now...')
});

// Define the handlers
const handlers = {};
// Sample handler
handlers.hello = function(data, callback) {
    // Callback a http status code, and a payload object
    callback(200,{'WelcomeMessage':'Hello World!'});
};

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

// Define the routers
const router = {
    'hello' : handlers.hello
};