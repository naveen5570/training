const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');


router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var employee = new Employee();
    employee.firstName = req.body.firstName;
    employee.Surname =req.body.Surname;
    employee.email = req.body.email;
    employee.gender = req.body.gender;
    employee.profession = req.body.profession;
    employee.age = req.body.age;
    employee.postcode = req.body.postcode;
    employee.fatherorigin = req.body.fatherorigin;
    employee.facebookname = req.body.facebookname;
    employee.mobilephone = req.body.mobilephone;
    employee.instagramname = req.body.instagramname;
	employee.twittername = req.body.twittername;
    employee.homeaddress = req.body.homeaddress;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('diasporans/thanks');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('diasporans/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/thanks', (req, res) => {
    
            res.render("employee/thanks");
        }
       
);


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;
            case 'Surname':
                body['SurnameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'gender':
                body['genderError']= err.errors[field].message;
                break;
            case 'profession':
                body['professionError'] = err.errors[field].message;
                break;
            case 'age':
                body['ageError'] = err.errors[field].message;
                break;
            case 'postcode':
                body['postcodeError'] = err.errors[field].message;
                break;
            case 'fatherorigin':
                body['fatheroriginError'] = err.errors[field].message;
                break;
            
            case 'mobilephone':
                body['mobilephoneError'] = err.errors[field].message;
                break;
           
            case 'homeaddress':
                body['homeaddressError'] =err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/diasporans/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;