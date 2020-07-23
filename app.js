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
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

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

//start sever
app.listen(3000, function(){
	console.log('start on server 3000...')
});