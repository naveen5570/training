require('./models/db');

const express = require('express');
var session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const employeeController = require('./controllers/employeeController');
const { ensureAuthenticated } = require('./config/auth');
var app = express();

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

app.use('/employee', employeeController);
app.use(session({secret:'XASDASDA'}));

var employees = mongoose.model("Employee");
app.get("/admin/employees", async (req, res) => {
    if(req.session.email)
    {
    const posts = await employees.find();
    var string = JSON.stringify(posts);
    var employeeData = JSON.parse(string);
    console.log(req.session.email);

    res.render('new/employees.pug', {employeeData:employeeData});
}
else
{
res.redirect('/admin/login');
}
});

app.get('/admin/edit-employee/:id',async(req,res)=>{
    var query = { _id: mongoose.Types.ObjectId(req.params.id)}
    const employee = await employees.find(query);
    res.render('new/edit-employee.pug', {'id': req.params.id, employeeData:employee});
    });

    app.post('/admin/updateEmployee', function(req, res){
    
        //console.log(req.file.originalname);
        //var n = req.body.firstName;
        //console.log('test=>'+n);
        
        var query = {_id:req.body.id};
        var newvalues = {$set: {firstName:req.body.firstName,Surname:req.body.Surname,email:req.body.email,gender:req.body.gender,profession:req.body.profession,age:req.body.age,fatherorigin:req.body.fatherorigin,postcode:req.body.postcode,instagramname:req.body.instagramname,facebookname:req.body.facebookname,mobilephone:req.body.mobilephone,homeaddress:req.body.homeaddress}};
            
        employees.update(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
        });
        res.redirect('back');
        });

        app.get('/admin/delete-employee/:id',async(req,res)=>{
            var query = { _id:req.params.id};
            const employee = await employees.remove(query, function(err, obj) {
                if (err) throw err;
                console.log("1 document(s) deleted");
                res.redirect('back');
              });
            });

            app.get('/',function(req,res){
                
               /*
               * Here we have assign the 'session' to 'ssn'.
               * Now we can create any number of session variable we want.    
               * Here we do like this.
               */
               // YOUR CODE HERE TO GET COMPORT AND COMMAND
               req.session.email; 
                
            });

app.get('/admin/login', function(req,res){
    console.log(req.session.email);
    if(req.session.email)
    {
    res.redirect('/admin/employees');  
    }
    else
    {
        res.render('new/login.pug');    
    }
});

app.post('/admin/login1', function(req,res) {
    
   if(req.body.email=='test' && req.body.password=='test')
   {
   req.session.email = req.body.email;
   res.redirect('/admin/employees');
   console.log(req.session.email);
   }
  });

  app.get('/admin', function(req,res){
      if(req.session.email)
      {
        res.redirect('/admin/employees');   
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