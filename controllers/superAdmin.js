
const admins=require("../models/admin");
const User = require("../models/User");

exports.signup = async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = new admins({
        email: email.toLowerCase(),
        password: password,
        //   language: language,
      });
      await admin.save();
      res
        .status(201)
        .json({success:true, message: 'Signup Successful', admin });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: 'Error' })
    }
  };


  
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await admins.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await admin.matchPasswords(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = await admin.generateAdminAuthToken();
    res
    .status(200).json({
      success: true,
      token,
      admin,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const { search } = req.body;
    const admin = await User.aggregate([
      {
        $match: {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
          ],
        },
      },
    ])
    res
    .status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id)
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res
    .status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.adminforgotPassword = async (req, res) => {
  try {
    const { email,password } = req.body;
    console.log(req.body);
    if (!email) {
      return res
        .status(200)
        .json({error:"Please provide email"});
    }
    if (!password) {
      return res
        .status(200)
        .json({error:"Please provide email"});
    }
    const admin = await admins.findOne({
      email: email,
    });
    if (!admin) {
      return res
        .status(200)
        .json({error:"Email is not registered"});
    }
    admin.password = password
    await admin.save();
    res.status(200).json({success:true, message: 'Password changed', admin });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Error ' }, );
  }
};
