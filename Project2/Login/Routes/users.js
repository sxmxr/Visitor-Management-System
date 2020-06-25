const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

router.get('/welcome',forwardAuthenticated,(req,res)=> {res.render('welcome')});
router.get('/login', forwardAuthenticated,(req, res) => {res.render('login')});
router.get('/register',forwardAuthenticated, (req, res) => {res.render('register')});

router.post('/register', (req, res) => {  
  const{name,email,contact,password, password2} = req.body;
  let errors = [];

  //check require Fields
  if(!email || !name || !contact || !password || !password2)
  {
    error.push({msg : 'Please fill in all fields'})
  }

  //Check password match
  if(password != password2)
  {
    error.push({msg : 'Password not match'})
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
  User.findOne({email:email})
   .then(user =>
    {
      if(user)
      {
        errors.push({msg : 'Email is already registered'});
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      }
      else
      {
          const newUser = new User(
            {
              name,
              email, 
              password
            }
          );
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  // req.flash(
                  //   'success_msg',
                  //   'You are now registered and can log in'
                  // );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
      }
    });
  }

});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
module.exports = router;