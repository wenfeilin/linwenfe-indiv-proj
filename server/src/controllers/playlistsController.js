const { getNewPlaylistId, addSongsToPlaylist } = require("../services/spotify-api");

// Create a new playlist with the requested songs in it.
async function makePlaylist(req, res) {
  const accessToken = req.cookies["access_token"];
  const month = req.body.month;
  const year = req.body.year;
  const songUris = req.body.songUris;

  try {
    // Create new empty playlist.
    const playlistId = await getNewPlaylistId(month, year, accessToken);
  
    // Add songs to new playlist.
    await addSongsToPlaylist(playlistId, songUris, accessToken);
  
    // Send back the playlist ID.
    res.status(201).json({playlistId: playlistId});
  } catch (err) {
    console.log(err);
    res.status(400).json({error: "Failed to create the playlist."});
  }
}

module.exports = { makePlaylist }