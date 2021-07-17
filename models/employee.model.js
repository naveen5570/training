const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'This field is required.'
    },
    Surname:{
        type:String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
    gender: {
        type:String,
        required: 'This field is required.'
    },
    profession:{
        type:String,
        required: 'This field is required.'
    },
    age:{
        type:String,
        required: 'This field is required.'
    },
    postcode:{
        type:String,
        required: 'This field is required.'
    },
    fatherorigin:{
        type:String,
        required: 'This field is required.'
    },
    facebookname:{
        type:String,
       
    },
    mobilephone:{
        type:String,
        required: 'This field is required.'
    },
    instagramname:{
        type:String,
       
    },
	twittername:{
        type:String,
       
    },
    homeaddress:{
        type:String,
        required: 'This field is required.'
    },

});


// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('Employee', employeeSchema);