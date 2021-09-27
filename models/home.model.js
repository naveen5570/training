const mongoose = require('mongoose');
var homeSchema = new mongoose.Schema({
    topcontent: { type: String, required: true },
    vendorcontent: { type: String, required: true },
    coursecontent:{type:String, required:true},
    
  
  },{ timestamps: true });
  
  
  mongoose.model('Home', homeSchema);  