const express = require('express');
const port = 9000;
const app = express();

// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');



app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    // This is called as interpolation here
    console.log(`Server is running on port: ${port}`);
});