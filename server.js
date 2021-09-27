require('./models/db');

const express = require('express');

var session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer'); 
var razorpay = require('razorpay');
const employeeController = require('./controllers/employeeController');
const { ensureAuthenticated } = require('./config/auth');
var app = express();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './views/uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({
  storage: storage // this saves your file into a directory called "uploads"
  
}); 
// Passport Config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'pug');
var User = mongoose.model("User");
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
var server=app.listen(process.env.PORT || 8080,function()
{
})
app.use('/views', express.static(__dirname + '/views'));

// var server=app.listen(3000,function()
// {
// });
// app.listen(3000, () => {
//     console.log('Express server started at port : 3000');
// });



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'naveen.uniyal5@gmail.com',
      pass: 'Naveen!@#123'
    }
  });






app.use(session({secret:'XASDASDA'}));

var employees = mongoose.model("Employee");




    

            



app.get('/admin/login', function(req,res){
    console.log(req.session.email);
    if(req.session.email)
    {
    res.redirect('/admin/new-vendor');  
    }
    else
    {
        res.render('new/login.pug');    
    }
});




var userModel = mongoose.model("User");
app.post('/admin/login1', async(req,res) =>{
    var query = { email: req.body.email};
    const admin = await userModel.find(query);
    var admin1 = JSON.stringify(admin);
    //var admin2 = JSON.parse(admin1);
    //console.log(admin[0].password);
   if(req.body.email==admin[0].email && req.body.password==admin[0].password)
   {
   req.session.email = req.body.email;
   req.session.role = admin[0].role;
   res.redirect('/admin/new-vendor');
   console.log(req.session.email);
   }
   else
   {
    res.redirect('/admin/login');    
   }
  });

  app.get('/admin', function(req,res){
      if(req.session.email)
      {
        res.redirect('/admin/new-vendor');   
      }
      else
      {
res.redirect('/admin/login');
      }  
});

app.get('/admin/logout', function(req,res){
req.session.destroy();
res.redirect('/admin');
});







app.get('/admin/new-admin',function(req,res){
    if(req.session.email && req.session.role==0)
    {
res.render('new/new-admin.pug');
    }
    else
    {
res.redirect('/admin/login');   
    }
});


app.post('/admin/make-admin',function(req,res){
    new userModel({
    name: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    role: '1'
    }).save(function(err,doc){
    if(err)res.json(err);
    else console.log('success');
    res.redirect('/admin/new-admin');
    //else res.render('user/application2',{id:doc._id});
});
});

app.get('/admin/admin-list',async(req,res)=>{
    if(req.session.email && req.session.role==0)
    {
    const admin = await userModel.find();
    res.render('new/admin-list.pug', {adminData:admin});
    }
    else
    {
        res.redirect('/admin/login');    
    }
    });

app.get('/admin/delete-admin/:id',async(req,res)=>{
        var query = { _id:req.params.id};
        const admin = await userModel.remove(query, function(err, obj) {
            if (err) throw err;
            console.log("1 document(s) deleted");
            res.redirect('back');
          });
        });


app.get('/admin/forgot-password',async(req,res)=>{
            
            res.render('new/forgot-password.pug');
            
            });

app.get('/admin/reset-password/:id',async(req,res)=>{
            
                res.render('new/reset-password.pug',{id:req.params.id});
                
                });




app.post('/admin/forgot-password',async(req,res)=>{
    var query = { email: req.body.email};
    const admin = await userModel.find(query);
    if(admin[0].email)
     {
        var mailOptions = {
            from: 'info@nigeriansindiasporauk.com',
            to: req.body.email,
            subject: 'Password Reset Email',
            text: 'https://www.nigeriansindiasporauk.com/admin/reset-password/'+admin[0]._id
          };  
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 
          res.redirect('back'); 
     } 
     else
     {
         res.redirect('/admin/login');
        }
          
        });



app.post('/admin/reset-password',async(req,res)=>{
            var query = { _id: req.body.id};
            var newvalues = {$set: {password:req.body.password}};
            
        userModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        }); 
        res.redirect('/admin/login');
});





// Vendor Section 

app.get('/admin/new-vendor', function(req,res){
    if(req.session.email && req.session.role==0)
    {
res.render('admin/new-vendor.pug');
    }
    else
    {
res.redirect('/admin/login');   
    }
});

var vendorModel = mongoose.model("Vendor");

app.post('/admin/save-vendor',upload.single('img'), function(req,res){
    new vendorModel({
    name: req.body.name,
    description: req.body.description,
    img: req.file.originalname,
    }).save(function(err,doc){
    if(err)res.json(err);
    else console.log('success');
    res.redirect('/admin/new-vendor');
    //else res.render('user/application2',{id:doc._id});
});
});


app.get("/admin/vendors", async (req, res) => {
    if(req.session.email)
    {
    
    const posts = await vendorModel.find();
    var string = JSON.stringify(posts);
    var vendorData = JSON.parse(string);
    console.log(req.session.email);

    res.render('admin/vendors.pug', {vendorData:vendorData, role:req.session.role});
}
else
{
res.redirect('/admin/login');
}
});

app.get('/admin/edit-vendor/:id',async(req,res)=>{
    if(req.session.email)
    {
    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
    const vendor = await vendorModel.find(query);
    res.render('admin/edit-vendor.pug', {'id': req.params.id, vendorData:vendor, role:req.session.role});
    }
    else
    {
        res.redirect('/admin/login');   
    }    
});

    app.post('/admin/updateVendor',upload.single('img'), function(req,res){
    
        //console.log(req.file.originalname);
        //var n = req.body.firstName;
        //console.log('test=>'+n);
        
        var query = {_id:req.body.id};
        if(req.file)
        {
         console.log('img update');  
         var newvalues = {$set: {name:req.body.name,description:req.body.description, img:req.file.originalname}};
            
        vendorModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        }); 
        }
        else
        {
            console.log('img not update');
            var newvalues = {$set: {name:req.body.name,description:req.body.description}};
            
        vendorModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        });
        }


        
        
        res.redirect('back');
    
    
        });

        app.get('/admin/delete-vendor/:id',async(req,res)=>{
            var query = { _id:req.params.id};
            const employee = await vendorModel.remove(query, function(err, obj) {
                if (err) throw err;
                console.log("1 document(s) deleted");
                res.redirect('back');
              });
            });



// Product section

app.get('/admin/new-product',async(req,res)=>{
    if(req.session.email && req.session.role==0)
    {
        const vendors = await vendorModel.find();
        var string = JSON.stringify(vendors);
        var vendorData = JSON.parse(string);
res.render('admin/new-product.pug', {vendorData:vendorData});
    }
    else
    {
res.redirect('/admin/login');   
    }
});

var productModel = mongoose.model("Product");

app.post('/admin/save-product',upload.single('img'), function(req, res, file){
    new productModel({
    name: req.body.name,
    description: req.body.description,
    img: req.file.originalname,
    vendor_id:req.body.v_id
    }).save(function(err,doc){
    if(err)res.json(err);
    else console.log('success');
    res.redirect('/admin/new-product');
    //else res.render('user/application2',{id:doc._id});
});
});

/*
app.get("/admin/products", async (req, res) => {
    if(req.session.email)
    {
    
    const posts = await productModel.find().populate('vendor_id');
    var string = JSON.stringify(posts);
    var productData = JSON.parse(string);
    console.log(productData);

    res.render('admin/products.pug', {productData:productData, role:req.session.role});
}
else
{
res.redirect('/admin/login');
}
});

app.get('/admin/edit-product/:id',async(req,res)=>{
    if(req.session.email)
    {
    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
    const product = await productModel.find(query);
    const vendors = await vendorModel.find();
    res.render('admin/edit-product.pug', {'id': req.params.id, vendorData:vendors, productData:product, role:req.session.role});
    }
    else
    {
        res.redirect('/admin/login');   
    }    

});

    app.post('/admin/updateProduct', upload.single('img'), function(req, res, file){
    
        //console.log(req.file.originalname);
        //var n = req.body.firstName;
        //console.log('test=>'+n);
        
        var query = {_id:req.body.id};
        if(req.file)
        {
         console.log('img update');  
         var newvalues = {$set: {name:req.body.name, vendor_id:req.body.v_id, description:req.body.description, img:req.file.originalname}};
         
           
        categoryModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        }); 
        }
        else
        {
            console.log('img not update');
            var newvalues = {$set: {name:req.body.name, vendor_id:req.body.v_id, description:req.body.description}};
           
            categoryModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        });
        }


        
        
        
        res.redirect('back');
        });

        app.get('/admin/delete-product/:id',async(req,res)=>{
            var query = { _id:req.params.id};
            const employee = await productModel.remove(query, function(err, obj) {
                if (err) throw err;
                console.log("1 document(s) deleted");
                res.redirect('back');
              });
            });

*/



// Category section

app.get('/admin/new-category',async(req,res)=>{
    if(req.session.email && req.session.role==0)
    {
        const vendors = await vendorModel.find();
        var string = JSON.stringify(vendors);
        var productData = JSON.parse(string);
res.render('admin/new-category.pug', {productData:productData});
    }
    else
    {
res.redirect('/admin/login');   
    }
});

var categoryModel = mongoose.model("Category");

app.post('/admin/save-category',upload.single('img'), function(req, res, file){
    new categoryModel({
    name: req.body.name,
    description: req.body.description,
    img: req.file.originalname,
    vendor_id:req.body.product_id
    }).save(function(err,doc){
    if(err)res.json(err);
    else console.log('success');
    res.redirect('/admin/new-category');
    //else res.render('user/application2',{id:doc._id});
});
});


app.get("/admin/categories", async (req, res) => {
    if(req.session.email)
    {
    
    const posts = await categoryModel.find().populate('vendor_id');
    var string = JSON.stringify(posts);
    var categoryData = JSON.parse(string);
    console.log(req.session.email);

    res.render('admin/categories.pug', {categoryData:categoryData, role:req.session.role});
}
else
{
res.redirect('/admin/login');
}
});

app.get('/admin/edit-category/:id',async(req,res)=>{
    if(req.session.email)
    {
    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
    const category = await categoryModel.find(query);
    const vendors = await vendorModel.find();
    res.render('admin/edit-category.pug', {'id': req.params.id, vendorData:vendors, categoryData:category, role:req.session.role});
    }
    else
    {
        res.redirect('/admin/login');    
    }    
});

app.post('/admin/updateCategory', upload.single('img'), function(req, res){
    
        
        
        var query = {_id:req.body.id};
        if(req.file)
        {
         console.log('img update');  
         var newvalues = {$set: {name:req.body.name, vendor_id:req.body.v_id, description:req.body.description, img:req.file.originalname}};
            
        categoryModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        }); 
        }
        else
        {
            console.log('img not update');
            var newvalues = {$set: {name:req.body.name,vendor_id:req.body.v_id, description:req.body.description}};
            
        categoryModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        });
        }


        
        
        
        res.redirect('back');
        });

app.get('/admin/delete-category/:id',async(req,res)=>{
            var query = { _id:req.params.id};
            const employee = await categoryModel.remove(query, function(err, obj) {
                if (err) throw err;
                console.log("1 document(s) deleted");
                res.redirect('back');
              });
            });





// Course section

app.get('/admin/new-course',async(req,res)=>{
    if(req.session.email && req.session.role==0)
    {
        const categories = await categoryModel.find();
        var string = JSON.stringify(categories);
        var categoryData = JSON.parse(string);
res.render('admin/new-course.pug', {categoryData:categoryData});
    }
    else
    {
res.redirect('/admin/login');   
    }
});

var courseModel = mongoose.model("Course");

app.post('/admin/save-course',upload.single('img'), function(req, res, file){
    var i=1;
    var schedule_arr=[];
    while(i<=50)
    {
        
        var qq= 'start_date'+i;
        var hh= 'start_time'+i;
        var qq1= 'end_date'+i;
        var hh1= 'end_time'+i;
        var qu = req.body[qq];
        var hi = req.body[hh];
        var qu1 = req.body[qq1];
        var hi1 = req.body[hh1];
        if(qu)
        {
         var obj = {startdate:qu, starttime:hi, enddate:qu1, endtime:hi1}
         schedule_arr.push(obj);
        }
        i++;
    }
console.log(schedule_arr);
    new courseModel({
    name: req.body.name,
    description: req.body.description,
    img: req.file.originalname,
    price: req.body.price,
    category_id:req.body.category_id,
    schedules:schedule_arr
    

    }).save(function(err,doc){
    if(err)res.json(err);
    else console.log('success');
    res.redirect('/admin/new-course');
    //else res.render('user/application2',{id:doc._id});
});
});


app.get("/admin/courses", async (req, res) => {
    if(req.session.email)
    {
    
    const posts = await courseModel.find().populate('category_id');
    var string = JSON.stringify(posts);
    var courseData = JSON.parse(string);
    console.log(req.session.email);

    res.render('admin/courses.pug', {courseData:courseData, role:req.session.role});
}
else
{
res.redirect('/admin/login');
}
});

app.get('/admin/edit-course/:id',async(req,res)=>{
    if(req.session.email)
    {  
    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
    const course = await courseModel.find(query);
    const categories = await categoryModel.find();
    res.render('admin/edit-course.pug', {'id': req.params.id, categoryData:categories, courseData:course, role:req.session.role});
    }
    else
    {

    res.redirect('/admin/login');
    }
});

app.post('/admin/updateCourse', upload.single('img'), function(req, res, file){
    
        //console.log(req.file.originalname);
        //var n = req.body.firstName;
        //console.log('test=>'+n);
        var i=1;
    var schedule_arr=[];
    while(i<=50)
    {
        
        var qq= 'start_date'+i;
        var hh= 'start_time'+i;
        var qq1= 'end_date'+i;
        var hh1= 'end_time'+i;
        var qu = req.body[qq];
        var hi = req.body[hh];
        var qu1 = req.body[qq1];
        var hi1 = req.body[hh1];
        if(qu)
        {
         var obj = {startdate:qu, starttime:hi, enddate:qu1, endtime:hi1}
         schedule_arr.push(obj);
        }
        i++;
    }
console.log(schedule_arr);
        var query = {_id:req.body.id};
        if(req.file)
        {
            var newvalues = {$set: {name:req.body.name, price:req.body.price, category_id:req.body.category_id, schedules:schedule_arr, description:req.body.description, img:req.file.originalname}};
           
            courseModel.update(query, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                
            });
        }
        else
        {
        
            var newvalues = {$set: {name:req.body.name, price:req.body.price, category_id:req.body.category_id, schedules:schedule_arr, description:req.body.description}};
           
            courseModel.update(query, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                
            });    
        }
        
        res.redirect('back');
        });

app.get('/admin/delete-course/:id',async(req,res)=>{
            var query = { _id:req.params.id};
            const employee = await courseModel.remove(query, function(err, obj) {
                if (err) throw err;
                console.log("1 document(s) deleted");
                res.redirect('back');
              });
            });


var settingModel = mongoose.model("Setting");
app.get('/admin/update-logo',async(req,res)=>{
const setting = await settingModel.find();
//console.log(setting.logo);
res.render('admin/update-logo.pug',{logo:setting});
});

app.post('/admin/save-logo',upload.single('img'), function(req, res, file){
    new settingModel({
    logo: req.file.originalname,
    }).save(function(err,doc){
    if(err)res.json(err);
    else console.log('success');
    res.redirect('/admin/update-logo');
    
});
});


var homeModel = mongoose.model("Home");
app.get('/',async (req,res)=>{
                
                /*
                * Here we have assign the 'session' to 'ssn'.
                * Now we can create any number of session variable we want.    
                * Here we do like this.
                */
                // YOUR CODE HERE TO GET COMPORT AND COMMAND
                req.session.email; 
                const vendors = await vendorModel.find();
                const courses = await courseModel.find().limit(4).populate('category_id');
                const homecontent = await homeModel.find();
                res.render('site/index.pug',{vendorData:vendors, courseData:courses, homecontent:homecontent});
                
             });

app.get('/vendor/:id',async(req,res)=>{
                var query = { _id: mongoose.Types.ObjectId(req.params.id)}
                var query1 = { vendor_id: mongoose.Types.ObjectId(req.params.id)}
                const vendor = await vendorModel.find(query);
                const categories = await categoryModel.find(query1);
                res.render('site/single-vendor.pug', {'id': req.params.id, categoryData:categories, vendorData:vendor});
                });


app.get('/category/:id',async(req,res)=>{
                    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
                    var query1 = { category_id: mongoose.Types.ObjectId(req.params.id)}
                    const category = await categoryModel.find(query);
                    const course = await courseModel.find(query1);
                    res.render('site/single-category.pug', {'id': req.params.id, categoryData:category, courseData:course});
                    });

app.get('/course/:id',async(req,res)=>{
                        var query = { _id: mongoose.Types.ObjectId(req.params.id)}
                        
                        const course = await courseModel.find(query);
                        
                        res.render('site/single-course.pug', {'id': req.params.id, courseData:course});
                        });

app.get('/vendors',async(req,res)=>{
    const vendors = await vendorModel.find();
                        
                        res.render('site/vendors.pug', {vendorData:vendors});
                        });

//search  
app.get('/search',(req,res)=>{  
    try {  
    courseModel.find({$or:[{name:{'$regex':req.query.dsearch}}]},(err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
    res.render('site/search.pug',{data:data});  
    }  
    })  
    } catch (error) {  
    console.log(error);  
    }  
    });


// purchase page

app.get('/purchase/id=:id&schedule=:schedule',async(req,res)=>{
    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
    
    const course = await courseModel.find(query);
    course.forEach(element => {
        
    var sched = 'Date: '+element.schedules[req.params.schedule].startdate+' to '+element.schedules[req.params.schedule].enddate+' Timings: '+element.schedules[req.params.schedule].starttime+' to '+element.schedules[req.params.schedule].endtime;
    //console.log(sched);
    var price = element.price;
    //console.log(price);
    var course_id = element._id;
    var course_name = element.name;
    //console.log(course_id);
    res.render('site/purchase.pug', {schedule:sched, price:price, course_id:course_id, course_name:course_name });      
});
    
    //res.render('site/single-course.pug', {'id': req.params.id, courseData:course});
    });





// Razorpay Payment configurations

app.get('/payment', function(req,res){
    res.render('site/standard.pug');
});

var instance = new razorpay({
    key_id: 'rzp_test_rF6DE6mn9DYb6v',
    key_secret: '8hj0CXTnVrsdWniOcG66NwJE',
  });

var orderModel = mongoose.model("Order");

app.post('/create/orderId',(req,res)=>{
console.log(req.body.name);
var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    
    new orderModel({
        
        course: req.body.course,
        schedule: req.body.schedule,
        
        payment_id:'',
        price: req.body.amount,
        order_id:order.id,
        payment_status:'initiated'
        }).save(function(err,doc){
        if(err)
        {
        res.json(err);
        }
        else 
        {
        console.log('success');
        //res.redirect('/admin/new-vendor');
        res.send({orderId:order.id});
        }
  });


});
});





app.post("/api/payment/verify",async(req,res)=>{
     
    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', '8hj0CXTnVrsdWniOcG66NwJE')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
     {
        var query = { order_id: req.body.response.razorpay_order_id}
    
        const order = await orderModel.find(query);
        var newvalues = {$set: {name:req.body.name, email:req.body.email, phone:req.body.phone, payment_id:req.body.response.razorpay_payment_id,payment_status:"completed"}};
            
        orderModel.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        });
        var mailOptions = {
            from: 'naveen@markuplounge.com',
            to: req.body.email,
            subject: 'Confirmation',
            text: "Your schedule booked"
          };  
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
      response={"signatureIsValid":"true"}
      return res.send(response);
      
     }
        });
   


app.get("/thank-you", function(req, res){
res.render('site/thanks.pug');    
});
        

app.get("/admin/orders", async (req, res) => {
            if(req.session.email)
            {
            
            const posts = await orderModel.find();
            var string = JSON.stringify(posts);
            var vendorData = JSON.parse(string);
            console.log(req.session.email);
        
            res.render('admin/orders.pug', {orderData:vendorData, role:req.session.role});
        }
        else
        {
        res.redirect('/admin/login');
        }
        });




app.get('/admin/edit-homecontent',async(req,res)=>{
            if(req.session.email)
            {
          
            const home = await homeModel.find();
            res.render('admin/edit-homecontent.pug', {homeData:home, role:req.session.role});
            }
            else
            {
                res.redirect('/admin/login');   
            }    
        });
        
app.post('/admin/updateHomecontent', function(req,res){
            
                //console.log(req.file.originalname);
                //var n = req.body.firstName;
                //console.log('test=>'+n);
                
                var query = {_id:req.body.id};
                
                    
                    var newvalues = {$set: {topcontent:req.body.topcontent,vendorcontent:req.body.vendorcontent,coursecontent:req.body.coursecontent}};
                    
                homeModel.update(query, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    
                });
                res.redirect('back');       
            });
        