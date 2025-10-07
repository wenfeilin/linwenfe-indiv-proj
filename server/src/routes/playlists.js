const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.send("Make playlist");
});

module.exports = router;