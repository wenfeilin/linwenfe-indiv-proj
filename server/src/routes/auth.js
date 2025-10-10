const express = require("express");
const { login, callbackHandler,refreshTokenHandler } = require("../controllers/authController");
const router = express.Router();

// Routes files define endpoints and map them to controller functions.

// This is a GET request because logging in requests a page (the login/authorization page).
router.get("/login", login);
router.get("/callback", callbackHandler);
router.get("/refresh", refreshTokenHandler);

module.exports = router;
