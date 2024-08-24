const Order = require('../models/order');
const User = require("../models/user");
const Product = require("../models/product");
const auth = require('../auth');
const crypto = require("crypto");


// [CHECKOUT]
module.exports.checkOutOrder = async (req, res) => {
	const invoiceNumber = crypto.randomBytes(16).toString("hex");
	const orderDetailsRaw = req.body.orderDetails;
	
	if (req.user.isAdmin){
		return res.status(401).send("Action Forbidden")};	

	if (!orderDetailsRaw || orderDetailsRaw.length === 0) {
	  return res.status(400).json({ error: "Order details are missing." });
	}
	// Validate pickUpDate
	const pickUpDate = new Date(req.body.pickUpDate);
	const currentDate = new Date();

    // Set the time components of pickUpDate and currentDate to midnight (00:00:00)
	pickUpDate.setHours(0, 0, 0, 0);
	currentDate.setHours(0, 0, 0, 0);

	if (pickUpDate < currentDate) {
	  return res.status(400).json({ error: "Invalid Pick Up Date. It must be the current date or a date in the future." });
	}

	// Calculate totalAmount and add subTotal to each order detail
	let totalAmount = 0;
	const orderDetails = [];
  
	for (const item of orderDetailsRaw) {
	  const productOrderedName = item.productOrderedName;
	  const productId = item.productId;
	  const quantity = item.quantity;
  
	  if (!productOrderedName && !productId) {
		return res.status(400).json({ error: "Both product name and product ID are missing. Please include atleast one." });
	  }
  
	  // Fetch the product's price based on either product name or ID
	  let product;
	  if (productOrderedName) {
		product = await Product.findOne({ name: productOrderedName });
	  } else {
		product = await Product.findById(productId);
	  }
  
	  if (!product) {
		return res.status(404).json({ error: "Product not found." });
	  }
  
	  const subTotal = product.price * quantity;
	  totalAmount += subTotal;
  
	  orderDetails.push({
		productOrderedName: product.name,
		productId: product._id,
		quantity,
		subTotal
	  });
	}
  
	const newOrder = new Order({
		invoiceNo: invoiceNumber,
		orderedBy: req.user.id,
		pickUpDate: pickUpDate,
		total: totalAmount,
		orderDetails,
	  });
	
	  newOrder
		.save()
		.then((newOrder) => {
		  // Format the pickUpDate to send only the date portion
		  newOrder.pickUpDate = newOrder.pickUpDate.toISOString().split('T')[0]; // Extract date portion
		  res.json(newOrder);
		})
		.catch((err) => res.status(500).json({ error: "Internal server error." }));
	};
  
  

// [VIEW ALL ORDERS]
module.exports.viewAllOrders = (req, res) => {

	Order.find({})
	.then(result => res.send(result))
	.catch(err => res.send(err));
};

// [VIEW ALL ORDERS BY CURRENT USER]
module.exports.viewMyOrders = (req, res) => {
	Order.find({ orderedBy: req.user.id })
	  .then((orders) => {
		if (orders.length === 0) {
		  return res.status(404).send('No orders');
		}
		res.send(orders);
	  })
	  .catch((err) => res.status(500).send(err));
  };


// [UPDATE ORDER STATUS]
module.exports.updateOrderStatus = async (req, res) => {
	try {
	  const orderId = req.params.id;
	  const newStatus = req.body.status;
  
	  // Check if the user is an admin
	  if (!req.user.isAdmin) {
		return res.status(403).json({ msg: 'Unauthorized' });
	  }
  
	  // Check if the provided status is in the allowed enum values
	  const allowedStatusValues = ['Order Placed', 'In Progress', 'Ready for Pickup', 'Order Completed'];
	  
	  if (!allowedStatusValues.includes(newStatus)) {
		return res.status(400).json({ error: 'Invalid status value.' });
	  }
  
	  const order = await Order.findByIdAndUpdate(
		orderId,
		{ status: newStatus },
		{ new: true }
	  );
  
	  if (!order) {
		return res.status(404).json({ msg: 'Order not found' });
	  }
  
	  res.json(order);
	} catch (err) {
	  console.error(err.message);
	  res.status(500).send('Server error');
	}
  };
  
  