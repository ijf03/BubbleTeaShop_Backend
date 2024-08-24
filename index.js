const express = require('express'); 

const cors = require('cors'); 

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');


const mongoose = require('mongoose'); 

const app = express();

const port = 4009;

mongoose.connect("mongodb+srv://Wasabi03:admin123@course-booking.lqwortv.mongodb.net/s49-s53?retryWrites=true&w=majority",{
		useNewUrlParser: true,
		useUnifiedTopology: true
});

let db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection Error"));

db.once('open', () => console.log("Connected to MongoDB"));

app.use(express.json());

app.use(cors());
app.use('/b9/users', userRoutes);
app.use('/b9/products', productRoutes);
app.use('/b9/orders', orderRoutes);


if (require.main === module) {
	app.listen(process.env.PORT || port, () => {
	  console.log(`API is now online on port ${process.env.PORT || port}`);
	});
  }
  
  module.exports = app;