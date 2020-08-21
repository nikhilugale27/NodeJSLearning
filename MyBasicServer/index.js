const http = require('http');
const port = 8000;
const fs = require('fs');

function requestHandler(req, res){
    console.log(req.url);
    res.writeHead(200, 'content-type'-'text/html');
    fs.readFile('./index.html', function(err, data){
        if(err){
            console.log(err);
            return res.end('<h1>Error.....!!!!</h1><h2>Please check the enyered Data.</h2>');
        }
        return res.end(data);
    });
    // res.end("<h1>Got it...</h1>");
}

const server = http.createServer(requestHandler);

server.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("The server will restart automatically due to changes in index.js file.")
    console.log("The server is ready on port :"+port);
});