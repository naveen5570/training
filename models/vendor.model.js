const mongoose = require('mongoose');
var vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    img:{type:String, required:true},
    dateAdded:{  type:Date, default:Date.now()}
  
  },{ timestamps: true });
  
  
  mongoose.model('Vendor', vendorSchema);  