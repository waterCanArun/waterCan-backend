const jwt = require("jsonwebtoken");
const Admin = require("../../watercan-main/models/User");
async function tokenAdminAuthorisation(req, res, next) {
  const token = req.header("x-auth-token-admin");
  if (!token)
    return res
      .status(401)
      .json("Access Denied. No token provided.", res.statusCode);
  try {
    const decoded = jwt.verify(token, "ultra-security");
    req.admin = decoded;
    const admin = await Admin.findById(req.admin._id);
    next();
  } catch (ex) {
    return res
      .status(400)
      .json("You are not Authenticated");
  
}
}
module.exports = tokenAdminAuthorisation;
