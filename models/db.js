const mongoose = require('mongoose');

/*
mongoose.connect('mongodb+srv://naveen123:Pass123@cluster0-nxrhl.mongodb.net/EmployeeDB?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});
*/


mongoose.connect('mongodb+srv://naveen123:Pass123@cluster0.nxrhl.mongodb.net/newProject', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./employee.model');
require('./user.model');
require('./vendor.model');
require('./product.model');
require('./category.model');
require('./course.model');
require('./setting.model');