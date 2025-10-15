const {searchSpotifySong} = require("../services/spotify-api");

async function searchSong(req, res) {
  // Retrieves song being searched for from the query parameter (?search=...)
  const searchedSong = req.query.search;
  const accessToken = req.cookies["access_token"];

  const data = await searchSpotifySong(searchedSong, accessToken);
  const tracksArr = data.tracks.items;
  const trackDetails = tracksArr.map((track) => {
    return {
      album: {
        name: track.album.name,
        mediumCoverImgURL: track.album.images[1].url,
        smallCoverImgURL: track.album.images[2].url,
      },
      artists: track.artists.map((artist) => artist.name),
      durationMS: track.duration_ms,
      id: track.id,
      name: track.name,
      uri: track.uri,
    };
  });

  res.json(trackDetails);
}

module.exports = { searchSong };
