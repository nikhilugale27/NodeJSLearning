const express = require('express');

// use express router
app.use('/', require('./routes'));

const port = 9000;

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    // This is called as interpolation here
    console.log(`Server is running on port: ${port}`);
});