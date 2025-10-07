const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Search for a song")
})

router.put("/play", (req, res) => {
  res.send("Play song")
});

module.exports = router;
