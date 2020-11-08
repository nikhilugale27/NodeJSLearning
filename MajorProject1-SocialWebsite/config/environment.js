const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'rushikasmane@gmail.com',
            pass: 'Nikhil@2020'
        }
    },
    google_client_id: "751616247699-fnum7rru2nav74l14qusanueangkqveb.apps.googleusercontent.com",
    google_client_secret: "utsYo-XVeo16dU4OurNrZCyd",
    google_call_back_url: "http://localhost:9000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH ,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_SMTP_USER,
            pass: process.envCODEIAL_SMTP_PASS
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_KEY,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development: eval(process.env.CODEIAL_ENVIRONMENT);