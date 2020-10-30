const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    acessToken : {
            type: String,
            required: true
    },
    isValid :{
        type: Boolean,
    }
},
    {
        timestamps: true   
    }    
);

const resetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = resetPassword;