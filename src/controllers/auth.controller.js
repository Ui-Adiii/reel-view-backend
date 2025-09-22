import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import FoodPartner from "../models/foodpartner.model.js";

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (
      !fullName ||
      fullName === "" ||
      email === "" ||
      !email ||
      password === "" ||
      !password
    ) {
      return res.status(422).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }
    if(password.length < 6){
      return res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      }); 
    }
    if(!/^[a-zA-Z ]+$/.test(fullName)){
      return res.status(400).json({
        success: false,
        message: "fullName must contain only letters and spaces",
      });
    }
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
      return res.status(400).json({
        success: false,
        message: "invalid email format",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:'1d'});

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        success: true,
        message: "user registered successfully",
        user,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser =async (req, res) => {
try {
    const {  email, password } = req.body;
    if (
      email === "" ||
      !email ||
      password === "" ||
      !password
    ) {
      return res.status(422).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    
    if(!user){
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      }); 
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      }); 
    } 

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const {password:pass,...rest} = user._doc;
    return res
      .status(200)
      .cookie("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7*24 * 60 * 60 * 1000, 
      })
      .json({
        success: true,
        message: "user logged in successfully",
        user: rest,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    
    return res.status(200).json({
      success: true,
      message: "user logged out successfully",
    });
    
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const registerFoodPartner = async (req, res) => {
  try {
    const { name, email, password, phone, address, contactName } = req.body;
    if (
      !name ||
      name === "" ||
      email === "" ||
      !email ||
      password === "" ||
      !password
      || !phone || phone === "" || !address || address === "" || !contactName || contactName === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const exist = await FoodPartner.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Food Partner already exist",
      });
    }
    if(password.length < 6){
      return res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      }); 
    }
    
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
      return res.status(400).json({
        success: false,
        message: "invalid email format",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const partner = await FoodPartner.create({
      name,
      email,
      phone,
      address,
      contactName,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET,{expiresIn:'1d'});

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        success: true,
        message: "Food partner registered successfully",
        partner,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginFoodPartner =async (req, res) => {
try {
    const { email, password } = req.body;
    if (
      email === "" ||
      !email ||
      password === "" ||
      !password
    ) {
      return res.status(422).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const exist = await FoodPartner.findOne({ email }).select("+password");
    
    if(!exist){
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      }); 
    }
    
    const isPasswordMatch = await bcrypt.compare(password, exist.password);
    if(!isPasswordMatch){
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      }); 
    } 

    const token = jwt.sign({ id: exist._id }, process.env.JWT_SECRET);
    const {password:pass,...rest} = exist._doc;
    return res
      .status(200)
      .cookie("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7*24 * 60 * 60 * 1000, 
      })
      .json({
        success: true,
        message: "FoodPartner logged in successfully",
        FoodPartner: rest,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const logoutFoodPartner = (req, res) => {
  try {
    return res.status(200)
    .cookie("token", "")
    .json({
      success: true,
      message: "FoodPartner logged out successfully",
    });
    
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export { registerUser, loginUser ,logoutUser,registerFoodPartner,loginFoodPartner,logoutFoodPartner};
