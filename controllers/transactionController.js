const Transaction = require("../models/transaction");
const Customer = require("../models/customer");
const Driver = require("../models/driver");
const User = require("../models/User");

// Create
exports.createTransaction = async (req, res) => {
  try {
    const { customerId, combo, driverId, paymentTaken, dueAmount, dateTime } =
      req.body;
    if (!driverId) {
      return res.status(400).json({ error: "Driver ID is required" });
    }
    const driver = await Driver.findById(driverId);
    const driverName = driver.name;
    const userId = req.params.userId;

    if (!customerId || !dateTime || !combo || !paymentTaken) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerName = customer.name;
    // Create a new route
    let bottlesCount = customer.bottlesLeft;
    let emailMessage = `Hi ${customer.name},here is your receipt\nTransaction Details:\n\n`;
    await combo.forEach((item) => {
      emailMessage += `Type: ${item.type}\n`;
      emailMessage += `Bottles Delivered: ${item.bottlesDelivered}\n`;
      emailMessage += `Bottles Received: ${item.bottlesReceived}\n\n`;
      bottlesCount += item.bottlesDelivered - item.bottlesReceived;
    });
    await Customer.findOneAndUpdate(
      { _id: customerId },
      { $set: { txnDate: dateTime } }
    );

    await Customer.findByIdAndUpdate(customerId, { bottlesLeft: bottlesCount });
    const transaction = new Transaction({
      userId,
      customerId,
      combo,
      driverId,
      paymentTaken,
      dueAmount,
      dateTime,
      driverName,
      customerName,
      bottlesCount,
    });
    await transaction.save();

    // Return the created transaction
    res.status(201).json({
      success: true,
      message: "transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Error creating transaction" });
  }
};

exports.transactionHistory = async (req, res) => {
  try {
    // Fetch all transactions from the database
    const transactions = await Transaction.find(); // Remove the userId filter
    console.log("All Transactions:", transactions);
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

exports.customerTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const customerId = req.params.customerId;
    // Fetch all transaction from the database
    const transactions = await Transaction.find({ userId, customerId });
    // console.log("Transactions :",userId,transactions)
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching Transaction:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};
