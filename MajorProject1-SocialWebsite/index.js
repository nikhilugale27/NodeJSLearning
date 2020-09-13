const express = require('express');
const port = 9000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser')

//used for the session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);

//use the scss middleware
const sassMiddleWare = require('node-sass-middleware');

//set up the SCSS Middleware
app.use(sassMiddleWare({
    src:'/assets/scss',
    dest:'/assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

//set up for POST Requests
app.use(express.urlencoded());

//set up the cookie Parser
app.use(cookieParser());

//setting up the static assets
app.use(express.static('./assets'));

//use the layout
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//mongo-store is used to store the session cookie in the DB
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
      mongooseConnection: db,
      autoRemove: 'disabled'  
    }, function(err){
        console.log(err || 'Connect-mongodb setup is OK.');
    })
}));


//Use the passport
app.use(passport.initialize());
app.use(passport.session());

//middleware uis getting called
app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    // This is called as interpolation here
    console.log(`Server is running on port: ${port}`);
});