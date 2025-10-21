const express = require("express");
const router = express.Router();
const { playSong, transferPlayback/*, loop, shuffleSongs*/ } = require("../controllers/playerController")
const { checkAccessToken } = require("../middleware/spotifyAuthMiddleware");

// Starts playing the specified song
router.put("/play", checkAccessToken, playSong);

// Transfers playback to the player so music can be played in the browser
router.put("/device", checkAccessToken, transferPlayback);

// Loops song(s)
// router.put("/loop", checkAccessToken, loop)

// Shuffles songs
// router.put("/shuffle", checkAccessToken, shuffleSongs)

module.exports = router;