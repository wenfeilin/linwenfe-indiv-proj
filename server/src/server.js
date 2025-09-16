const express = require("express");
const app = express();

app.get("/api/messages", (req, res) => {
  // Send "Hello, World" message.
  res.send("Hello, World!");
});

// Server runs on port 5000.
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
