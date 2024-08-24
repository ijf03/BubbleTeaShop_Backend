const Product = require('../models/product');

const auth = require('../auth');

//[CREATE A PRODUCT]

module.exports.createProduct = (req, res) => {
    Product.find({})
        .then(products => {
            let filtered = products.filter(product => {
                return product['name'] === req.body.name;
            });

            if (filtered.length === 0) {
                let newProduct = new Product({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                });
                newProduct.save()
                    .then(savedProduct => {
                        res.json({
                            message: "Product added successfully",
                            product: savedProduct,
                        });
                    })
                    .catch(err => res.status(500).send(err));
            } else {
                return res.status(409).send("Product is already created");
            }
        })
        .catch(err => res.status(500).send(err));
};


// [RETRIEVE ALL PRODUCTS]

module.exports.getAllProduct = (req, res) => {

	Product.find({})
	.then(result => res.send(result))
	.catch(err => res.send(err));
};

// [RETRIEVE ACTIVE PRODUCTS]
module.exports.getActiveProducts = (req, res) => {
    Product.find({ isActive: true })
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

//[GET SINGLE PRODUCT]
module.exports.getSingleProduct =(req, res) => {
	
	console.log(req.params);

	Product.findById(req.params.id)
	.then(result => res.send(result))
	.catch(error => res.send(error))

};


// [UPDATE PRODUCTS]
module.exports.updateProduct = (req, res) => {
    // Specify the fields/properties of the document to be updated
    let updates = {
        name : req.body.name,
        description	: req.body.description,
        price : req.body.price
    };

    // Syntax
        // findByIdAndUpdate(document ID, updatesToBeApplied)
    return Product.findByIdAndUpdate(req.params.id, updates).then((product, error) => {

        // Product not updated
        if (error) {
            return res.send(false);
s
        // Product updated successfully
        } else {				
            return res.send(true);
        }
    })
    .catch(err => res.status(500).send(err));
};

module.exports.updateCourse = (req, res) => {
    // Specify the fields/properties of the document to be updated
    let updates = {
        name : req.body.name,
        description	: req.body.description,
        price : req.body.price
    };

    // Syntax
        // findByIdAndUpdate(document ID, updatesToBeApplied)
    return Product.findByIdAndUpdate(req.params.id, updates).then((product, error) => {

        // Product not updated
        if (error) {
            return res.send(false);

        // Product updated successfully
        } else {				
            return res.send(true);
        }
    })
    .catch(err => res.send(err))
};

//[ARCHIVE A PRODUCT]

module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Product.findByIdAndUpdate(req.params.id, updateActiveField)
    .then((product, error) => {

        //course archived successfully
        if(error){
            return res.send(false)

        // failed
        } else {
            return res.send(true)
        }
    })
    .catch(err => res.send(err))

};


//[ACTIVATE A PRODUCT]

module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }

    return Product.findByIdAndUpdate(req.params.id, updateActiveField)
        .then((course, error) => {

        //course archived successfully
        if(error){
            return res.send(false)

        // failed
        } else {
            return res.send(true)
            }
    })
    .catch(err => res.send(err))

};

//[DELETE A PRODUCT ]
module.exports.deleteProduct = (req, res) => {

	Product.findByIdAndRemove(req.params.id).exec()
	.then(doc => {
		if (!doc) {return res.status(404).end();}
		return res.status(204).end();
	})
	.catch(err => res.send(err));
};


//[SEARCH PRODUCT BY NAME]
module.exports.searchProductsByName = async (req, res) => {
	try {
	  const { productName } = req.body;
  
	  // Use a regular expression to perform a case-insensitive search
	  const products = await Products.find({
		name: { $regex: productName, $options: 'i' }
	  });
  
	  res.json(products);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
};

//[SEARCH PRODUCTS BY PRICE RANGE]
exports.searchProductsByPriceRange = async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.body;
  
      // Find products within the price range
      const products = await Products.find({
        price: { $gte: minPrice, $lte: maxPrice }
      });
  
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for products' });
    }
  };