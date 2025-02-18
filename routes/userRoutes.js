const express = require('express')
const router = express.Router();
const { login,register } = require('../controllers/auth');

const {createUser,getUserById,updateUser,deleteUser,verifyUserCredentials, addProductForUser, getProductsForUser, updateProductForUser, deleteProductForUser, forgotPassword} = require('../controllers/userController');
const { getAllProducts, addProduct } = require('../controllers/productController');

// Create a new User
// !404 Not Found Requested resource could not be found. 😐
router.post('/users', createUser);

// Get a User by ID
// !500 Internal Server Error The server has encountered a situation it does not know how to handle.
router.get('/users/:id', getUserById);

// Update a User by ID
router.put('/users/:id', updateUser);

// Delete a User by ID
// !500 Internal Server Error The server has encountered a situation it does not know how to handle.
router.delete('/users/:id', deleteUser);

// Add product
// router.post('/products',addProduct);
// router.get('/allproducts',getAllProducts)
// !404 Not Found Requested resource could not be found. 
router.post('/users/verify', verifyUserCredentials);

// !404 Not Found Requested resource could not be found. 
router.post('/users/passwordChanged', forgotPassword);

// !404 Not Found Requested resource could not be found. 
router.get('/users/:userId/products',getProductsForUser)


router.post('/users/:userId/products',addProductForUser)
router.put('/users/:userId/products/:productId',updateProductForUser)

// !500 Internal Server Error The server has encountered a situation it does not know how to handle.
router.delete('/users/:userId/products/:productId',deleteProductForUser)


// !404 Not Found Requested resource could not be found. 
router.route("/login").post(login);

// !404 Not Found Requested resource could not be found. 
router.route("/register").post(register);

module.exports=router;