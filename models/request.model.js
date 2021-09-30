const mongoose = require('mongoose');
var requestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone:{type:Number, required:true},
    state:{type:String, required:true},
    job_title:{type:String, required:true},
    company:{type:String, required:true},
    
  
  },{ timestamps: true });
  
  
  mongoose.model('Request', requestSchema);  