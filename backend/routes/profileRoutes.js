const express = require("express");
const router = express.Router();

const {
  getProfile,
  saveProfile,
} = require("../controllers/profileController");

// GET PROFILE
router.get("/:userId", getProfile);

// CREATE / UPDATE PROFILE
router.post("/save", saveProfile);

module.exports = router;