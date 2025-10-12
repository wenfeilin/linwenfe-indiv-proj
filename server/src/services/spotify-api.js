const axios = require("axios");

async function searchSpotifySong(searchedSong, accessToken) {
  const api_base_url = "https://api.spotify.com/v1/";
  const params = new URLSearchParams({
    q: searchedSong,
    type: "track",
    limit: 10, // for now
    include_external: "audio",
  });

  const response = await axios.get(
    `${api_base_url}search?${params.toString()}`, {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    }
  ); // already parsed as JS object from JSON by axios
  return response.data; 
}

module.exports = { searchSpotifySong };
