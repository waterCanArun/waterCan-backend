const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  updateDueAmt,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// Create a new customer
// !500 Internal Server Error The server has encountered a situation it does not know how to handle.
router.post("/customers/to/:userId", createCustomer);

// router.post('/customers', createCustomer);
// ?200 OK Request successful. The server has responded as required.
router.get("/get-customers", getAllCustomers);

// Get a customer by ID
// ?working
router.get("/customers/:id", getCustomerById);

// Update a customer by ID
// !400 Bad Request The server could not understand the request. Maybe a bad syntax?
router.put("/update-customer/:customerId", updateCustomer);

// Delete a customer by ID
// ? working
router.delete("/delete-customer/:customerId", deleteCustomer);

//update due amount
// !500 Internal Server Error The server has encountered a situation it does not know how to handle.
router.post("/customers/:id/due-amount-update", updateDueAmt);

module.exports = router;
