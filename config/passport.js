const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Load User model
var User = mongoose.model("User");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      var user = [email=>'test',password=>'test'];
      if(email=='test' && password=='test')
      {
return done(null, user);
      
      }
      else
    {
      return done(null, false, { message: 'Password incorrect' }); 
    }
      /*User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
         bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
          */
         
        
      
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};