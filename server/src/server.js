require("dotenv").config();

const app = require("./app");
const cors = require('cors');

const PORT = process.env.PORT || 5000;

// allow requests from frontend dev server
app.use(cors({
  origin: process.env.FRONTEND_URL
}))

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
