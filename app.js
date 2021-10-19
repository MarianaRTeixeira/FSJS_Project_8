var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/** STEP 5
 *  Test connection to the database and sync the model
*/

 const sequelize = require('./models').sequelize;

 (async () => {
   try {
     await sequelize.authenticate();
     console.log('Connection to the database successful!');
   } catch (error) {
     console.error('Error connecting to the database: ', error);
   }
 })();

/** STEP 7
 *  Set up middleware
 */

// catch 404 and forward to error handler
app.use(function(req, res, next ){
  //create new error
  const error = new Error;
  error.status = 404
  error.message = 'Page not Found. Please check again';
 //Render the page-not-found
 res.status(404).render('page-not-found');
});

// error handler
app.use(function(err, req, res, next) {

if(err.status === 404 ){
    res.status(404).render('page-not-found', { err });
   } else {
    res.status(err.status||500).render('error', { err })
    err.message = (err.message || 'Sorry! There was an unexpected error on the server');
   }  
}); 

module.exports = app;
