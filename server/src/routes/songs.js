const express = require("express");
const { searchSong } = require("../controllers/songsController");
const { checkAccessToken } = require("../middleware/spotifyAuthMiddleware");
const router = express.Router();

router.get("/", checkAccessToken, searchSong); // req and res are implicitly sent by Express

module.exports = router;
