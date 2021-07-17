const mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    img:{type:String, required:true},
    vendor_id: {type:mongoose.Schema.Types.ObjectId,
        ref:'Vendor'
        },
    dateAdded:{  type:Date, default:Date.now()}
  
  });
  
  
  mongoose.model('Product', productSchema);  