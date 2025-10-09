const express = require("express")
const router = express.Router();

// This is a GET request because logging in requests a page (the login/authorization page).
router.get("/login", )


router.get("/callback", (req, res) => {
  res.send("Call callback function (the one that gets the access token by exchanging it w/ the auth code)")
})

module.exports = router;