const express = require("express");
const router = express.Router();

const {
  createTransaction,
  transactionHistory,
  customerTransactions,
} = require("../controllers/transactionController");

// Create a new transaction
router.post("/transaction/:userId", createTransaction);

// Get All Transactions (no userId filter anymore)
router.get("/transaction-history", transactionHistory); // Removed userId from the path

// Get Transactions for a specific customer under a userId
router.get("/transaction/:userId/:customerId", customerTransactions);

module.exports = router;
