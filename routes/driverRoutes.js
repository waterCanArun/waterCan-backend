const express = require('express')
const router = express.Router();

const {createDriver,getDriverById,verifyDriverCredentials,getAllDrivers, deleteDriver} = require('../controllers/driverController');

// Register a driver
// ? Working
router.post('/new-driver/:userId', createDriver);

// Get a Driver by ID
// ? Working
router.get('/driver/:id', getDriverById);
router.delete('/delete-driver/:driverId', deleteDriver);

// ? Working
router.get('/get-drivers/:userId',getAllDrivers)

//! 401 Unauthorized The request is unauthenticated.(password error)
router.post('/verify-driver', verifyDriverCredentials);


module.exports=router;