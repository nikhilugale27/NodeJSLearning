// require the library
const mongoose = require('mongoose');

//connect to db
mongoose.connect('mongodb://localhost/contact_list_db',{useNewUrlParser: true, useUnifiedTopology: true});

//accquire the connection
const db = mongoose.connection;

//check the connection status
db.on('error', console.error.bind(console, 'error in connecting to db'));

//show the status if get connected
db.once('open', function() {
  console.log('Connected to db Successfully...');
});