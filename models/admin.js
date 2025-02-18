const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
 
});

adminSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};


adminSchema.methods.generateAdminAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "ultra-security", {
    expiresIn: "90d",
  });
  return token;
};

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return (this.password = await bcrypt.hash(this.password, 7));
  }
  next();
});

const Admin = mongoose.model("superadmin", adminSchema);

module.exports = Admin;
