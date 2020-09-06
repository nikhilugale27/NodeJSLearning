const express = require('express');
const port = 9000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//setting up the static assets
app.use(express.static('./assets'));

//use the layout
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

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