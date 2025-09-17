const express = require("express");
const app = express();

app.get("/api/messages", (req, res) => {
  // Send "Hello, World" message.
  res.send("Hello, World!");
});

module.exports = app;
