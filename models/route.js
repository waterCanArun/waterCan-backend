const mongoose = require("mongoose");
const routeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    // Add reference to the user who created the route
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Add customers field to store customers associated with the route
    customers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    }],
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'driver'
    }
  });

const Route = mongoose.model('Route', routeSchema);


module.exports = Route;