const Product = require('../models/product');

exports.addProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    console.log("hello i am called!!",req.body)
    const prod = new Product({ productName: name, productDescription: description, productPrice: price, userId });
    await prod.save();
    console.log('Product Added:', prod);
    res.status(201).json({ message: 'Product added successfully', prod });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const { name, description, price } = req.body;

  // Validate the input fields
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Attempt to find and update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productName: name, productDescription: description, productPrice: price },
      { new: true } // This option returns the updated document
    );

    // If the product is not found
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond with the updated product data
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error getting products' });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    // Attempt to find and delete the product by its ID
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    // If the product is not found
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond with a success message and the deleted product data
    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};


exports.getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ error: 'Error getting product by ID' });
  }
};
