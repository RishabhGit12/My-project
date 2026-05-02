const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token and check if user is a food partner
async function verifyFoodPartner(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decode.id);

    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

async function verifyUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode.id);

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  verifyFoodPartner,
  verifyUser
};