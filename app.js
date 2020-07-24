const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/**/
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/myshop');
let db = mongoose.connection;

//check connection
db.once('open',function(){
console.log('success');
});

//check for db errors
db.on('error',function(err){
console.log(err);
});

//init app
const app = express();

//Bring in Models
let Product= require('./models/product');

//view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//badyparser middle ware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));
/**/
// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//home route
app.get('/',function(req, res){
	Product.find({},function(err, products){
		if(err){
			console.log(err);
		}else{
			res.render('index',{
				title:'products',
				products:products
			});				
		}
	
	});
});

//Route Files
let products = require('./routes/products');
app.use('/products', products)
let users = require('./routes/users');
app.use('/users', users)

//start sever
app.listen(3000, function(){
	console.log('start on server 3000...')
});