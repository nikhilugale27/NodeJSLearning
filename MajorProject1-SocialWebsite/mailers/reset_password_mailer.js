const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newReset = (resetData) => {

    let htmlString = nodeMailer.renderTemplate({reset: resetData}, '/users/reset_password.ejs');

    console.log('Inside Reset Password Mailer', resetData);

    let receiptMail = resetData.user.email;

    console.log('Receiving Mail - ',receiptMail);
    
    nodeMailer.transporter.sendMail({
       from: 'arpan@codingninjas.in',
       to: receiptMail,
       subject: "Reset Password Requested",
       html: htmlString 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}