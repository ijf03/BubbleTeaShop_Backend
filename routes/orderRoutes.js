const express = require('express');

const router = express.Router();

const orderControllers = require('../controllers/orderControllers')

const Order = require('../models/order');

const auth = require("../auth");

const {verify, verifyAdmin} = auth;

// [CHECKOUT]
router.post("/", verify, orderControllers.checkOutOrder);

// [RETRIEVE ALL ORDERS]
router.get("/viewAllOrders", verify, verifyAdmin, orderControllers.viewAllOrders);

// [RETRIEVE MY ORDERS]
router.get("/viewMyOrders", verify, orderControllers.viewMyOrders);

// [ UPDATE ORDER STATUS]
router.put('/:id/status', verify, verifyAdmin, orderControllers.updateOrderStatus);


module.exports = router;