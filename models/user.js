const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: [true, "User Name is required"]
		},

		firstName: {
			type: String,
			required: [true, "First Name is required"]
		},

		lastName: {
			type: String,
			required: [true, "Last Name is required"]
		},
		
		email: {
			type: String,
			required: false
		},

		password: {
			type: String,
			required: [true, "Password is required"]
		},

		mobileNo: {
			type: String,
			required: [true, "Mobile Number is required"]
		},

		isAdmin: {
			type: Boolean,
			default: false
		},
	}
);

module.exports = mongoose.model("User", userSchema);
