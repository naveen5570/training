const mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    course: { type: String, required: true },
    schedule: { type: String, required: true },
    name:{type:String},
    email:{type:String},
    phone:{type:String},
    payment_id:{type:String},
    price:{type:String},
    order_id:{type:String, required:true},
    payment_status:{type:String, required:true}
  
  },{ timestamps: true });
  
  
  mongoose.model('Order', orderSchema);  