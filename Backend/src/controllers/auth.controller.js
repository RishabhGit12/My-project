const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cookie Configuration Options for Cross-Domain Deployment (Vercel + Render)
const cookieOptions = {
  httpOnly: true,
  secure: true,      // Required for HTTPS links on Render/Vercel
  sameSite: "none",  // Allows the browser to send cookies cross-site
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days lifecycle
};

// ==========================================
// User Controllers
// ==========================================

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Attach cross-domain session cookie right on register
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error during registration", error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cross-domain secure cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error during login", error: err.message });
  }
}

function LogoutUser(req, res) {
  // Clear the cookie using identical security flags
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
}

// ==========================================
// Food Partner Controllers
// ==========================================

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;

    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({ email });

    if (isFoodPartnerAlreadyExists) {
      return res.status(400).json({
        message: "Food Partner Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName,
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Attach cross-domain session cookie right on register
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "Food Partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        address: foodPartner.address,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error during food partner registration", error: err.message });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cross-domain secure cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Food Partner logged in successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error during food partner login", error: err.message });
  }
}

function LogoutFoodPartner(req, res) {
  // Clear the cookie using identical security flags
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    message: "Food Partner logged out successfully",
  });
}

// Exporting the controllers
module.exports = {
  registerUser,
  loginUser,
  LogoutUser,
  registerFoodPartner,
  loginFoodPartner,
  LogoutFoodPartner,
};