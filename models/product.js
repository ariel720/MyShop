let mongoose = require('mongoose');

//Schema
let productSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	writer:{
		type: String,
		required: true
	},
	body:{
		type: String,
		required: true	
	}
});

let Product = module.exports = mongoose.model('Product',productSchema);