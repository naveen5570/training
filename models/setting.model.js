const mongoose = require('mongoose');
var settingSchema = new mongoose.Schema({
    
    logo:{type:String, required:true}
    
  
  });
  
  
  mongoose.model('Setting', settingSchema);  