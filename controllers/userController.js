const User = require('../models/User');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
// Create 
exports.createUser = async (req, res) => {
  try {
    
    const { name, email, mobileNo, password, address } = req.body;
    if (!name || !email || !mobileNo || !password || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = new User({ name, email, mobileNo, password, address });
    await user.save();
    console.log('User created:', user);
    res.status(201).json({success:true, message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Read 
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await User.findById(userId);
    if (user) {
      console.log('User found:', user);
      res.status(200).json(user);
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// Update 
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const newData = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (Object.keys(newData).length === 0) {
      return res.status(400).json({ error: 'No data provided for update' });
    }
    const user = await User.findByIdAndUpdate(userId, newData, { new: true });
    if (user) {
      console.log('User updated successfully:', user);
      res.status(200).json({ message: 'User updated successfully', user });
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete 
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await User.findByIdAndDelete(userId);
    if (user) {
      console.log('User deleted successfully');
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

exports.verifyUserCredentials = async (req, res) => {
  try {
    console.log("USER :",req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    // Find the user in the database by email
    const user = await User.findOne({ email }).select('+password');
    // console.log("user :",user)
    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log("check1",passwordMatch)
    console.log("passwordMatch",password," ",user.password)
    // passwordMatch = password===user.password
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    console.log("user : ",user)
    // If email and password are correct, generate a JWT token
    // const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Return success response with JWT token and user details
    res.status(200).json({ success: true, message: 'Login successful',  user });
  } catch (error) {
    console.error('Error verifying user credentials:', error);
    res.status(500).json({ error: 'Error verifying user credentials' });
  }
};

exports.getProductsForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extracted from JWT token in authentication middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(201).json({ products:user.products });
  } catch (error) {
    console.error('Error fetching product for user:', error);
    res.status(500).json({ error: 'Error fetching product for user.' });
  }
};

exports.addProductForUser = async (req, res) => {
  res.status(201).json({ message: 'ALL GOOD' });
  // try {
  //   const userId = req.params.userId; // Extracted from JWT token in authentication middleware
  //   const { name, description, price } = req.body;
  //   if (!name || !description || !price) {
  //     return res.status(400).json({ error: 'Name, description, and price are required for the product.' });
  //   }
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     return res.status(404).json({ error: 'User not found.' });
  //   }

  //   console.log("I got here--------------------------------- b sfjowfjowfjwoefjow----------");
  //   const productId = uuid.v4();
  //   user.products.push({ productId,name, description, price });
  //   await user.save();
  //   res.status(201).json({ message: 'Product added successfully for the user.', user });
  // } catch (error) {
  //   console.error('Error adding product for user:', error);
  //   res.status(500).json({ error: 'Error adding product for user.' });
  // }
};

// Update a product for the authenticated user
exports.updateProductForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extracted from JWT token in authentication middleware
    const productId = req.params.productId;
    const { name, description, price } = req.body;
    if (!productId || !name || !description || !price) {
      return res.status(400).json({ error: 'Product ID, name, description, and price are required for the update.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const product = user.products.id(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found for the user.' });
    }
    product.set({ name, description, price });
    await user.save();
    res.status(200).json({ message: 'Product updated successfully for the user.', user });
  } catch (error) {
    console.error('Error updating product for user:', error);
    res.status(500).json({ error: 'Error updating product for user.' });
  }
};

// Delete a product for the authenticated user
exports.deleteProductForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extracted from JWT token in authentication middleware
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    // Use findOneAndUpdate with $pull to remove the product from the array
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully for the user.', user: updatedUser });
  } catch (error) {
    console.error('Error deleting product for user:', error);
    res.status(500).json({ error: 'Error deleting product for user.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email,password } = req.body;
    console.log(req.body);
    if (!email) {
      return res
        .status(200)
        .json({error:"Please provide email"});
    }
    if (!password) {
      return res
        .status(200)
        .json({error:"Please provide email"});
    }
    const admin = await User.findOne({
      email: email,
    });
    if (!admin) {
      return res
        .status(200)
        .json({error:"Email is not registered"});
    }
    admin.password = password
    await admin.save();
    res.status(200).json({success:true, message: 'Password changed', admin });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Error ' }, );
  }
};
