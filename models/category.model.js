const mongoose = require('mongoose');
var categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    img:{type:String, required:true},
    course_excerpt:{ type: String},
    vendor_id: {type:mongoose.Schema.Types.ObjectId,
        ref:'Vendor'
        },
    dateAdded:{  type:Date, default:Date.now()}
  
  },{ timestamps: true });
  
  
  mongoose.model('Category', categorySchema);  