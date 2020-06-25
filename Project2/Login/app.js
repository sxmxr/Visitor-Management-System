const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app= express();
require('./config/passcode')(passport);
//DB Config
const db =require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology: true } )
  .then(()=>console.log('Mongo DB Connected!'))
  .catch(err => console.log(err));
//ejs
app.set('view engine','ejs');
app.use( express.static( "public" ) );

// Express body parser
app.use(express.urlencoded({extended : false}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//Routes
app.use('/',require('./Routes/index'));
app.use('/users',require('./Routes/users'));


const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`Server Started on port ${PORT}`));