const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

//Post /api/food [Protected Route - Food Partner Only]
router.post(
  '/',
  authMiddleware.verifyFoodPartner,
  upload.single("video"),
  foodController.createFood,
);

//Get /api/food [protected route - user only]
router.get(
  '/',
  authMiddleware.verifyUser,
  foodController.getFoodItems
);

module.exports = router