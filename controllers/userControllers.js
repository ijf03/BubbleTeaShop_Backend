const Product = require('../models/product');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('../auth');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// [CREATE A USER]

module.exports.registerUser = (req, res) => {

	User.find({})
	.then(users => {

		let filtered = users.filter(user => {
			return user['userName'] === req.body.userName
		})

		if(filtered.length === 0){

			const hashedPW = bcrypt.hashSync(req.body.password, 10)

			let newUser = new User({
				userName: req.body.userName,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: hashedPW,
				mobileNo: req.body.mobileNo
			})
			newUser.save();
			res.send(newUser);
		} else {
			return res.status(409).send('Username is already used')
		}
	})
	.catch(err => res.send(err));
}

// [GET ALL USERS]
module.exports.getAllUsers = (req, res) => {

	User.find({})
	.then(result => res.send(result))
	.catch(err => res.send(err));
};

// [LOGIN USER]

module.exports.loginUser = (req, res) => {
	User.findOne({ userName : req.body.userName} ).then(result => {

		console.log(result);

		// User does not exist
		if(result == null){

			return res.send(false);

		// User exists
		} else {
			
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
			// If the passwords match/result of the above code is true
			if (isPasswordCorrect) {

				return res.send({ access : auth.createAccessToken(result) })

			// Passwords do not match
			} else {

				return res.send(false);
			}
		}
	})
	.catch(err => res.send(err))
};


// [UPDATE TO ADMIN]

module.exports.updateAdmin = (req, res) => {

	let updates = {
		isAdmin: true
	}

	User.findByIdAndUpdate(req.params.id, updates, {new: true})
	.then(updatedUsers => {
		//console.log(updatedUsers)
		if(updatedUsers === null){
			return res.status(401).send('User does not exist');
			
		} else {
			res.send(updatedUsers)
		}
	})
	.catch(err => res.send(err));
};


// [UPDATE TO NOT ADMIN]
module.exports.updateNotAdmin = (req, res) => {
	let updates = {
	  isAdmin: false,
	};
  
	User.findByIdAndUpdate(req.params.id, updates, { new: true })
	  .then((updatedUser) => {
		if (updatedUser === null) {
		  return res.status(401).send("User does not exist");
		} else {
		  res.send(updatedUser);
		}
	  })
	  .catch((err) => res.send(err));
  };

// [GET SINGLE USER]

module.exports.getSingleUser =(req, res) => {
	
	console.log(req.params);

	User.findById(req.params.id)
	.then(result => res.send(result))
	.catch(error => res.send(error))

};

// [GET PROFILE]
module.exports.getUserProfile = (req, res) => {
	const userId = req.user.id; // Get the user ID from the authenticated token
	if (!ObjectId.isValid(userId)) {
		return res.status(400).json({ msg: 'Invalid user ID' });
	}

	User.findById(userId)
	  .then((user) => {
		if (!user) {
		  return res.status(404).json({ msg: 'User not found' });
		}
		res.json(user); // Send the user object as the response
	  })
	  .catch((err) => {
		console.error(err.message);
		res.status(500).send('Server error');
	  });
};

  

//[SECTION] Buy as a registered User
module.exports.buy = async (req, res) => {
    try {
        // Check if required parameters are present
        if (!req.body.productId || !req.body.productName || !req.body.productPrice) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Ensure the user is not an admin
        if (req.user.isAdmin) {
            return res.status(403).json({ message: 'Action Forbidden' });
        }

        const newPurchase = {
			productId: req.body.productId,
			productName: req.body.productName,
			productPrice: req.body.productPrice,
		};

        // Update the user's purchases
        const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (!user.purchase) {
			user.purchase = []; // Initialize if it's undefined
		}

		user.purchase.push(newPurchase);

		try {
			await user.save();
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error saving user data' });
		}

        // Update the product
        await Product.findByIdAndUpdate(
            req.body.productId,
            {
                $push: {
                    orders: { userId: req.user.id },
                },
            },
            { new: true }
        );

        res.status(200).json({ message: 'Purchased Successfully.' });
    } catch (error) {
		console.error(error); // Log the error for debugging
		res.status(500).json({ message: 'Something went wrong', error: error.message });
	}
	
};


  