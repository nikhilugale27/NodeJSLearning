const express = require('express');
const env = require('./config/environment');
const port = 9000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser')

//used for the session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');

const MongoStore = require('connect-mongo')(session);

const passportGoogle = require('./config/passport-google-oauth2-strategy');

//use the scss middleware
const sassMiddleWare = require('node-sass-middleware');

const flash = require('connect-flash');
const customMWare = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');

//set up the SCSS Middleware
app.use(sassMiddleWare({
    src:'./assets/scss',
    dest:'./assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

//set up for POST Requests
app.use(express.urlencoded({ extended: true }));

//set up the cookie Parser
app.use(cookieParser());

//setting up the static assets
app.use(express.static(env.asset_path));

//setting up the avatars folder
app.use('/uploads', express.static(__dirname + '/uploads'));

//setting up the icons folder
app.use('/icons', express.static(__dirname + '/icons'));

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
    secret: env.session_cookie_key,
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

//use the connect-flash
app.use(flash());
app.use(customMWare.setFlash);

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