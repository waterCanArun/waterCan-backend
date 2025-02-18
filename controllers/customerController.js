const Customer = require("../models/customer");
const Route = require("../models/route");
const mongoose = require("mongoose");
// Create
exports.createCustomer = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, mobileNo, location, address, route } = req.body;

    // Validate required fields
    if (!name || !email || !mobileNo || !location || !address || !route) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a customer with the provided email already exists
    const existingCustomer = await Customer.findOne({ email, userId });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists" });
    }

    // Create a new customer and assign to the route
    const customer = new Customer({
      name,
      email,
      mobileNo,
      location,
      address,
      userId,
      route, // Assign the route field with the selected route's ID
    });

    // Save the new customer to the database
    await customer.save();

    // Optionally, add the customer to the route's customer list (if your Route model has such a field)
    const selectedRoute = await Route.findById(route);
    if (!selectedRoute) {
      return res.status(400).json({ message: "Route not found" });
    }

    // If route has a 'customers' array, add the customer to it
    selectedRoute.customers.push(customer._id);
    await selectedRoute.save();

    console.log("Customer created and added to route:", customer);
    res.status(201).json({
      success: true,
      message: "Customer created and associated with route successfully",
      customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Error creating customer from backend" });
  }
};



exports.getAllCustomers = async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();

    // If no customers are found, send an appropriate response
    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found." });
    }

    // Send the customers data as the response
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error getting customers:", error);
    res.status(500).json({ error: "Error getting customers" });
  }
};



// Read
exports.getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }
    const customer = await Customer.findById(customerId);
    if (customer) {
      console.log("Customer found:", customer);
      res.status(200).json(customer);
    } else {
      console.log("Customer not found");
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Error fetching customer" });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const newData = req.body;
    console.log("New Data : ", newData, " \n Customer ID :", customerId);

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    if (Object.keys(newData).length === 0) {
      return res.status(400).json({ error: "No data provided for update" });
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    console.log("customer :", customer);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check if email already exists
    const validCustomer = await Customer.findOne({ email: newData.email });
    console.log("Valid Customer :", validCustomer);
    if (validCustomer && validCustomer._id.toString() !== customerId) {
      return res.status(409).json({ error: "Email Already Exists." });
    }

    // Update customer
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: customerId },
      {
        $set: {
          name: newData.name,
          email: newData.email,
          mobileNo: newData.mobileNo,
          address: newData.address,
        },
      },
      { new: true }
    );

    console.log("Updated Customer :", updatedCustomer);
    res
      .status(200)
      .json({
        success: true,
        message: "Customer updated successfully",
        customer: updatedCustomer,
      });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Error updating customer" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    // Find the customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    // TODO: DO IT LATOR
    // // Find the route associated with the customer
    // const routeId = customer.route;
    // const route = await Route.findById(routeId);
    // if (!route) {
    //   return res.status(404).json({ error: 'Route not found for the customer' });
    // }

    // // Remove the customer's ID from the route's customers array
    // route.customers.pull(customerId);
    // await route.save();

    // Delete the customer from the database
    await Customer.findByIdAndDelete(customerId);

    console.log("Customer deleted successfully");
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Error deleting customer" });
  }
};

exports.updateDueAmt = async (req, res) => {
  try {
    const customerId = req.params.id;
    const newDueAmt = req.body.newDueAmt;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }
    if (!newDueAmt && newDueAmt !== 0) {
      return res.status(400).json({ error: "New due amount is required" });
    }
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { dueAmt: newDueAmt },
      { new: true }
    );
    if (customer) {
      console.log("DueAmt updated successfully:", customer);
      res
        .status(200)
        .json({
          success: true,
          message: "DueAmt updated successfully",
          customer,
        });
    } else {
      console.log("Customer not found");
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error updating dueAmt:", error);
    res.status(500).json({ error: "Error updating dueAmt" });
  }
};
