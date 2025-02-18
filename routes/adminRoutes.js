const express = require('express');
const { signup, login, getUsers, deleteUser, adminforgotPassword } = require('../controllers/superAdmin');
const router = express.Router();

// !404 Not Found Requested resource could not be found. 😐
router.post("/Signup",signup)

// ?working
router.post("/Login",login)

router.patch("/getUser",getUsers)
router.delete("/deleteUser/:id",deleteUser)

// ! errorr
router.post("/changePassword",adminforgotPassword)


module.exports=router;





// report file create in route
// 1 perameters 
// 2 routs
// 3 connectivity