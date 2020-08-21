const express = require('express');
const path = require('path')
const port = 8000;

const db = require('./config/mongoose');

const Contact = require('./models/contact')
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('Assets'));

//MiddleWare 1
/*app.use(function(req,res,next){
    console.log('Hi I am Middleware 1');
    req.myName = 'Nikhil';
    next();
});
*/

//MiddleWare2
/*app.use(function(req,res,next){
    console.log('Hi I am Middleware 2');
    console.log('The name coming form Middleware 1 :', req.myName);
    next();
});
*/

var contactList = [
    {
        name: 'Batman',
        phone:'1234567895'
    },
    {
        name:'Superman',
        phone:'8596741236'
    },
    {
        name:'Iron Man',
        phone:'7412365897'
    }
]

app.get('/', function(req, res){
    // console.log('The Name received from Middleware 2 in home loading is ', req.myName);
    return res.render('home', {
        title: 'Contact List',
        contact_list: contactList
    });
});

app.get('/practice', function(req, res){
    return res.render('practice', {
        title: 'Contact Added Confirmation'
    });
});

app.post('/create-contact', function(req, res){
    //contactList.push(req.body);
    //return res.redirect('/');
    Contact.create({
        name:req.body.name,
        phone:req.body.phone
    },function(err, newContact)
    {
        if(err){
            console.log('Error in creating a contact!!!');
            return;
        }
        console.log('******', newContact);
        return res.redirect('back');
    });
});

app.get('/delete-contact/', function(req, res){
    console.log(req.query);
    let phone = req.query.phone

    let contactindex = contactList.findIndex(contact => contact.phone == phone);

    if(contactindex != -1){
        contactList.splice(contactindex, 1);
    }
    return res.redirect('back');
});

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})