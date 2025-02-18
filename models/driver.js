const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const driverSchema = new mongoose.Schema({
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
      select: true,
    },
    address:{
      type : String,
      required:true,
      select : true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  });
  
  driverSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  
  driverSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  driverSchema.methods.generateToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  };
  
  module.exports = mongoose.model("driver", driverSchema);