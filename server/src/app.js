const express = require("express");
const app = express();

// app.get("/api/messages", (req, res) => {
//   // Send "Hello, World" message.
//   res.send("Hello, World!");
// });

const songsRouter = require("./routes/songs");
app.use("/api/songs", songsRouter);

const playlistsRouter = require("./routes/playlists")
app.use("/api/playlists", playlistsRouter);

module.exports = app;
