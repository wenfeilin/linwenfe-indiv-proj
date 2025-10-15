const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const session = require("express-session");
const songsRouter = require("./routes/songs");
const playlistsRouter = require("./routes/playlists");
const authRouter = require("./routes/auth");
const playerRouter = require("./routes/player")

const app = express();
app.use(cookieParser());
app.use(express.json()); // to parse JSON from request bodies

// Allow requests from frontend dev server
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // to let cookies be sent w/ cross-origin requests
}))

// Set up session middleware. This makes `req.session` available in all routers.
// app.use(
//   session({
//     secret: "", // fill in later
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // maybe change to true in production? (check Express Session docs
//                                // page)
//   })
// );

// Mount the routers.
app.use("/auth", authRouter);
app.use("/api/songs", songsRouter);
app.use("/api/playlists", playlistsRouter);
app.use("/api/player", playerRouter);

module.exports = app;
