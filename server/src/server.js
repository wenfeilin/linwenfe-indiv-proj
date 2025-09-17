const app = require("./app");

// Server runs on port 5000.
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
