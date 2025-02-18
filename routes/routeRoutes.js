const express = require('express');
const router = express.Router();
const {createRoute,deleteRoute,updateRouteWithCustomers,getDriverAdmin,getRoutes,getRouteAndCustomerForDriver, updateRouteWithCustomersFromAdmin, routesGet, routesUpdate} = require('../controllers/routeController');

// Create a new customer
// ?working
router.post('/route', createRoute);

// get route for admin display
// ?working
router.get('/get-route',getRoutes);

// ?working
router.post('/routesUpdate/:id',routesUpdate);

// ?working
router.get('/getroute/:id',routesGet);

// !500 Internal Server Error The server has encountered a situation it does not know how to handle.
router.put('/update-route/:routeId',updateRouteWithCustomersFromAdmin);
// route.get('/route/:id',getRouteById);
router.delete('/delete-route/:routeId', deleteRoute);
// for the some user it work , alos not work for some user 
router.get('/get-all-admin-assigned/to/:driverId',getDriverAdmin)

router.post('/add-customer/to/:adminId/:routeId',updateRouteWithCustomers)

//get route for given driverId
router.get('/route/:driverId',getRouteAndCustomerForDriver)


module.exports = router;
