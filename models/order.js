const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purchaseDate: {
      type: Date,
      default: new Date()
    },
    pickUpDate: {
      type: Date,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    orderDetails: [
      {
        productOrderedName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        subTotal: {
          type: Number,
          required: true
        }
      }
    ],
    status: {
      type: String,
      enum: ['Order Placed', 'In Progress', 'Ready for Pickup', 'Order Completed'],
      default: 'Order Placed',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        // Customize the serialization to format the pickUpDate
        if (ret.pickUpDate instanceof Date) {
          ret.pickUpDate = ret.pickUpDate.toISOString().split('T')[0]; // Extract date portion
        }
        delete ret._id; // Remove the _id field
      },
    },
  }
);

// Set the order status based on the pickUpDate
orderSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (this.pickUpDate > currentDate) {
    this.status = 'Order Placed';
  } else {
    this.status = 'In Progress';
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
