const Route = require("../models/route");
const User = require("../models/User"); // Import User model
const Customer = require("../models/customer"); // Import Customer model
const Driver = require("../models/driver");

exports.createRoute = async (req, res) => {
  try {
    const { name, customers, userId, driverId } = req.body;

    // Check if all required fields are provided
    if (!name || !customers || !userId || !driverId) {
      return res.status(400).json({
        error: "Name, customers, user ID, and driver ID are required",
      });
    }

    // Check if the user and driver exist
    const user = await User.findById(userId);
    const driver = await Driver.findById(driverId);

    if (!user || !driver) {
      return res.status(404).json({ error: "User or Driver not found" });
    }
    const existingRoute = await Route.findOne({ name, user: userId });
    if (existingRoute) {
      return res
        .status(401)
        .json({
          error: "Route name must be unique,Try With Different Route Name.",
        });
    }
    // Iterate over the customers array and push each customer ID to the route's customers array
    const customerIds = [];
    for (const customerId of customers) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res
          .status(404)
          .json({ error: `Customer with ID ${customerId} not found` });
      }
      customerIds.push(customerId);
    }

    // const route = new Route({ name, user: userId, driver: driverId,driverData:driverData });
    const route = new Route({ name, user: userId, driver: driverId });
    route.customers.push(...customerIds); // Add customer IDs to the customers array
    await route.save();

    // Return the created route
    res
      .status(201)
      .json({ success: true, message: "Route created successfully", route });
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Error creating route" });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: `Route with ID ${routeId} not found` });
    }

    // Use deleteOne instead of remove
    await Route.deleteOne({ _id: routeId });

    res.status(200).json({ success: true, message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ error: "Error deleting route. Please try again" });
  }
};



exports.updateRouteWithCustomersFromAdmin = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { customers, driver } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    // Update the customers array
    route.customers = customers; // This will replace the current customers with the new list
    route.driver = driver; // Update the driver if necessary

    // Save the updated route
    await route.save();

    res.status(200).json({ success: true, route });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: "Error updating route" });
  }
};

exports.updateRouteWithCustomers = async (req, res) => {
  try {
    // Check if the user and driver exist
    const userId = req.params.adminId;
    // const customerId = req.params.customerId;
    // const driverId = req.params.driverId;
    const routeId = req.params.routeId;
    const user = await User.findById(userId);
    // const driver = await Driver.findById(driverId);

    const { name, email, mobileNo, location, address } = req.body.payload;
    if (!name || !email || !mobileNo || !location || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a customer with the provided email already exists
    const existingCustomer = await Customer.findOne({ email, userId });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists" });
    }

    // Create a new customer
    const customer = new Customer({
      name,
      email,
      mobileNo,
      location,
      address,
      userId,
      route: routeId,
    });
    await customer.save();
    const customerId = customer._id;

    if (!user) {
      throw new Error("User not found");
    }

    // Find the route by ID
    let route = await Route.findById(routeId);
    // const customer = await Customer.findById(customerId)
    // If the route doesn't exist, throw an error
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }

    // Iterate over the new customer IDs and add them to the route's customers array

    // if (!customer) {
    //   throw new Error(`Customer with ID ${customerId} not found`);
    // }
    route.customers.addToSet(customerId); // Add customer ID to the customers array if it's not already present

    // Save the route
    await route.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Customer created successfully",
        customer,
        route,
      });
    return route;
  } catch (error) {
    console.error("Error updating route with customers:", error);
    throw error;
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const { userId } = req.query; // Access userId from query parameters
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all routes from the database for the given userId
    const routes = await Route.find({ user: userId });

    // Return the routes
    res.status(200).json({ success: true, routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Error fetching routes" });
  }
};


exports.routesGet = async (req, res) => {
  try {
    const routes = await Route.findById(req.params.id)
    res.status(200).json({ success: true, routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Error fetching routes" });
  }
};
exports.routesUpdate = async (req, res) => {
  try {
    const {name,customer,driverId,} = req.body;
    const routes = await Route.findById(req.params.id);
    routes.name = name;
    routes.customers=customer
    routes.driver=driverId
    await routes.save();
    res.status(200).json({ success: true, routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Error fetching routes" });
  }
};

exports.getRouteAndCustomerForDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    // console.log("Driver ID : ",driverId)
    if (!driverId) {
      return res.status(400).json({ error: "Driver ID is required" });
    }
    // Find routes associated with the driver ID
    const routes = await Route.find({ driver: driverId });
    console.log("Routes :", routes);

    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: "Routes not found for the driver" });
    }
    // console.log("check1",routes)
    const customersByRoute = [];
    for (const route of routes) {
      const customerArr = [];
      const coordinates = [];
      const marker = [];
      const markerStatus = [];
      for (const customerId of route.customers) {
        await Customer.find({ _id: customerId })
          .then((customer) => {
            customerArr.push(customer[0]);
            console.log("check1 :", customer);
            if (customer[0].location) {
              const [latitude, longitude] = customer[0].location.split(",");
              coordinates.push({ latitude, longitude });
              const markerChild = {
                id: customer[0]._id,
                title: customer[0].name,
                coordinates: {
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                },
                details: {
                  name: customer[0].name,
                  address: customer[0].address,
                  phone: customer[0].mobileNo,
                  email: customer[0].email,
                  customer: customer[0],
                },
              };
              const markerStatusChild = {
                markerId: customerId,
                delivered: customer[0].txnDate,
              };
              markerStatus.push(markerStatusChild);
              marker.push(markerChild);
            } else {
              console.log("location not found");
            }
          })
          .catch((error) => {
            console.error("Error fetching customer data:", error);
          });
      }
      customersByRoute.push({
        route,
        customerArr,
        coordinates,
        marker,
        markerStatus,
        admin: route.user,
      });
    }
    return res.status(201).json({ customersByRoute });
  } catch (error) {
    console.error("Error fetching route and customers:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getDriverAdmin = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    if (!driverId) {
      return res.status(400).json({ error: "Driver ID is required" });
    }

    // Find all routes where the driver is the specified driverId
    const routes = await Route.find({ driver: driverId }).populate("user"); // Assuming the user field references the user who created the route

    // Extract unique user information from the routes
    const users = [];
    const userIds = new Set(); // Using a Set to keep track of unique user IDs
    for (const route of routes) {
      const { _id, name, email } = route.user;
      if (!userIds.has(_id)) {
        // Check if the user ID is already in the Set
        userIds.add(_id);
        users.push({ _id, name, email });
      }
    }
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
