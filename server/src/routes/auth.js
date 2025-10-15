const express = require("express");
const { getValidAccessToken, login, callbackHandler,refreshTokenHandler } = require("../controllers/authController");
const { checkAccessToken, checkLoginStatus } = require("../middleware/spotifyAuthMiddleware")
const router = express.Router();

// Routes files define endpoints and map them to controller functions.

// Returns the access token for the Spotify Player. The access token will be refreshed if it's 
// invalid.
router.get("/token", checkAccessToken, getValidAccessToken); 
// This is a GET request because logging in requests a page (the login/authorization page).
router.get("/login", login);
router.get("/status", checkLoginStatus);
router.get("/callback", callbackHandler);
router.get("/refresh", refreshTokenHandler);

module.exports = router;
