// Import the mongoose library
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Create a Product model based on the product schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;
