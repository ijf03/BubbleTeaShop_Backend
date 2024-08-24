const express = require('express');

const router = express.Router();

const productControllers = require('../controllers/productControllers')

const auth = require("../auth");

const {verify, verifyAdmin} = auth;

// [CREATE A NEW PRODUCT]
router.post("/AddProduct", verify, verifyAdmin, productControllers.createProduct);

// [RETRIEVE ALL PRODUCTS]
router.get("/", productControllers.getAllProduct);

// [RETRIEVE ONLY ACTIVE PRODUCTS]
router.get("/active", productControllers.getActiveProducts);

// [RETRIEVE SINGLE PRODUCTS]
router.get("/:id", productControllers.getSingleProduct);

// [UPDATE PRODUCT]
router.put("/update/:id", verify, verifyAdmin, productControllers.updateProduct)

// [ARCHIVE]
router.put("/archive/:id", verify, verifyAdmin, productControllers.archiveProduct)

// [ACTIVATE]
router.put("/activate/:id", verify, verifyAdmin, productControllers.activateProduct)

// [DELETE]
router.delete("/delete/:id", verify, verifyAdmin, productControllers.deleteProduct)

//[SEARCH PRODUCT BY PRODUCT NAME]
router.post('/searchByName', productControllers.searchProductsByName);	

//[SEARCH PRODUCTS BY PRICE RANGE]
router.post('/searchByPrice', productControllers.searchProductsByPriceRange);

module.exports = router;