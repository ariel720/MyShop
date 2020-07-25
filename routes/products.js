const express = require('express');
const router = express.Router();

let Product = require('../models/product');
let User = require('../models/user');



//Add product get
router.get('/add',ensureAuthenticated,function(req, res){
  res.render('add_product',{
    title:'Add Product'
  });
});

//Add product Post
router.post('/add',function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('writer','Writer is required').notEmpty();
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
    product.writer = req.user._id;
    product.body = req.body.body;

    product.save(function(err){
      if(err){
        console.log(err);

      }else{
        req.flash('success','Product created');
        res.redirect('/');
      }

    });
  }



});


//Edit Product get
router.get('/edit/:id', ensureAuthenticated, function(req,res){
  Product.findById(req.params.id, function(err, product){
    if(product.writer != req.user._id){
      req.flash('danger','Not Authorized');
      res.redirect('/');

    }
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

// Get Single Article
router.get('/:id', function(req, res){
  Product.findById(req.params.id, function(err, product){
    User.findById(product.writer, function(err, user){
      res.render('product', {
        product:product,
        writer: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}


module.exports = router;
