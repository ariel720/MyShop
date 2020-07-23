const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

//Read single obj
app.get('/product/:id', function(req,res){
  Product.findById(req.params.id, function(err, product){
  	res.render('product',{
  		product:product
  	});
  });
});



//Add product get
app.get('/products/add',function(req, res){
	res.render('add_product',{
		title:'Add Product'
	});
});

//Add product Post
app.post('/products/add',function(req,res){
	let product = new Product();
	product.title = req.body.title;
	product.writer = req.body.writer;
	product.body = req.body.body;

	product.save(function(err){

		if(err){
			console.log(err);

		}else{
			res.redirect('/');
		}

	});

});


//Edit Product get
app.get('/product/edit/:id', function(req,res){
  Product.findById(req.params.id, function(err, product){
  	res.render('edit_product',{
  		title:'Edit Product Information',
  		product:product
  	});
  });
});

//Edit product Post
app.post('/products/edit/:id',function(req,res){
	let product = {};
	product.title = req.body.title;
	product.writer = req.body.writer;
	product.body = req.body.body;

	let query = {_id:req.params.id}

	Product.update(query, product, function(err){
		if(err){
			console.log(err);

		}else{
			res.redirect('/product/'+req.params.id);

		}

	});

});

//Delete Product
app.delete('/product/:id', function(req, res){
	let query = {_id:req.params.id}
	Product.remove(query, function(err){
		if(err){
			console.log(err);
		}else{
			res.send('Success');
		}
	});
});

//start sever
app.listen(3000, function(){
	console.log('start on server 3000...')
});