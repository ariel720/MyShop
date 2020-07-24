const express = require('express');
const router = express.Router();

let Product = require('../models/product');




//Add product get
router.get('/add',function(req, res){
  res.render('add_product',{
    title:'Add Product'
  });
});

//Add product Post
router.post('/add',function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('writer','Writer is required').notEmpty();
  req.checkBody('body','body is required').notEmpty();
//Get error
  let errors = req.validationErrors();

  if(errors){
    res.render('add_product',{
      title:'Add Product',
      errors:errors
    });
  }else{

    let product = new Product();
    product.title = req.body.title;
    product.writer = req.body.writer;
    product.body = req.body.body;

    product.save(function(err){

      if(err){
        console.log(err);

      }else{
        req,flash('success','Product created');
        res.redirect('/');
      }

    });
  }



});


//Edit Product get
router.get('/edit/:id', function(req,res){
  Product.findById(req.params.id, function(err, product){
    res.render('edit_product',{
      title:'Edit Product Information',
      product:product
    });
  });
});

//Edit product Post
router.post('/edit/:id',function(req,res){
  let product = {};
  product.title = req.body.title;
  product.writer = req.body.writer;
  product.body = req.body.body;

  let query = {_id:req.params.id}

  Product.update(query, product, function(err){
    if(err){
      console.log(err);

    }else{
      req.flash('success','Product info updated');
      res.redirect('/products/'+req.params.id);

    }

  });

});

//Delete Product
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}
  Product.remove(query, function(err){
    if(err){
      console.log(err);
    }else{
      res.send('Success');
    }
  });
});

//Read single obj
router.get('/:id', function(req,res){
  Product.findById(req.params.id, function(err, product){
    res.render('product',{
      product:product
    });
  });
});


module.exports = router;
