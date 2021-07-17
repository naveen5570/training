const mongoose = require('mongoose');
var courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    img:{type:String, required:true},
    price:{type:String, required:true},
    category_id: {type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
        },
    schedules:[{
            startdate : String,
            enddate:String,
            starttime : String,
            endtime : String
             }],
    dateAdded:{  type:Date, default:Date.now()}
  
  });
  
  
  mongoose.model('Course', courseSchema);  