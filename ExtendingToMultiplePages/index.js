const http = require('http');
const port = 1542;
const fs = require('fs');

function requestHandler(req, res){
    let filePath;
    switch(req.url){
        case '/':
            filePath = './index.html';
            break;
        case '/profile':
            filePath = './profile.html';
            break;
        default:
            filePath = './404Error.html';     
    }
    fs.readFile(filePath, function(err, data){
        if(err){
            console.log('Error', err);
            return;
        }
        return res.end(data);
    })


}

const server = http.createServer(requestHandler);

server.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("The server is up and runing on port:"+port);
});