const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  mobileNo: {
    type: String,
    required: true,
    select: false,
  },
  address:{
    type : String,
    required:true,
    select : false,
  },
  userType:{
    type: String
  },
  products: [{
    productId:String,
    name: String,
    description: String,
    price: Number
    // Add other product fields here as needed
  }],
  // Add routes field to store user's routes
  routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }]
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);