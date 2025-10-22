const express = require("express");
const router = express.Router();
const {makePlaylist} = require("../controllers/playlistsController")
const {checkAccessToken} = require("../middleware/spotifyAuthMiddleware")

router.post("/", checkAccessToken, makePlaylist);

module.exports = router;