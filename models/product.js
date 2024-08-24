const mongoose = require('mongoose');

let productSchema = new mongoose.Schema(

	{
		name: {
			type: String,
			required: [true, "Product Name is required"]
		},
		
		image: {
			type: String,
			required: false
		},
		
		description: {
			type: String,
			required: [true, "Description is required"]
		},

		price: {
			type: Number,
			required: [true, "Price is required"]
		},

		isActive: {
			type: Boolean,
			default: true
		},

		createOn: {
			type: Date,
			default: new Date()
		}
	}
);


module.exports = mongoose.model("Product", productSchema);




