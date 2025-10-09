const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Search for a song")
})

module.exports = router;
