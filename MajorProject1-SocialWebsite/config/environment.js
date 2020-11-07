

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
}


const production =  {
    name: 'production'
}



module.exports = development;