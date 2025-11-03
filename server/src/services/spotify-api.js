const axios = require("axios");

// Songs

const api_base_url = "https://api.spotify.com/v1/";

async function searchSpotifySong(searchedSong, accessToken) {
  const params = new URLSearchParams({
    q: searchedSong,
    type: "track",
    limit: 15, // for now
    include_external: "audio",
  });

  try {
    const response = await axios.get(
      `${api_base_url}search?${params.toString()}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    ); // already parsed as JS object from JSON by axios
    return response.data;
  } catch (err) {
    console.log(err);
  }
}


// Player

const api_base_player_url = "https://api.spotify.com/v1/" + "me/player/";

async function startPlayback(device_id, songUris, accessToken) {
  // PUT /me/player/play
  const req_body = {
    uris: songUris,
    position_ms: 0, // start playing from beginning of song for now
  };

  try {
    console.log("Requesting start playback");
    const response = await axios.put(`${api_base_player_url}play?device_id=${device_id}`, req_body, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (err) {
    // console.log(err);
    console.log("Failed to start playback")
  }
}

async function transferPlaybackHelper(device_ids, accessToken) {
  // PUT /me/player
  const req_body = {
    device_ids: device_ids,
    play: false, // don't automatically play upon transferring playback to the player
  }

  try {
    const response = await axios.put(`${api_base_player_url}`, req_body, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (err) {
    console.log(err);
  }
}

// // state = "track", "context", "off"
// async function toggleLoop(state, device_id, accessToken) {
//   // PUT /me/player/repeat
//   try {
//     const response = await axios.put(`${api_base_player_url}repeat?state=${state}&device_id=${device_id}`, {
//       headers: {
//         Authorization: "Bearer " + accessToken,
//       },
//     });

//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function toggleShuffle(state, device_id, accessToken) {
//   // PUT /me/player/shuffle
//   try {
//     const response = await axios.put(`${api_base_player_url}shuffle?state=${state}&device_id=${device_id}`, {
//       headers: {
//         Authorization: "Bearer " + accessToken,
//       },
//     });
    
//     return response;
//   } catch (err) {
//     console.log(err)
//   }
// }


// Playlist

async function getNewPlaylistId(month, year, accessToken) {
  try {
    // Get user's Spotify ID.
    const profileResponse = await axios.get(`${api_base_url}me`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      }
    });
    const userId = profileResponse.data.id;
  
    const req_body = {
      "name": `${month} ${year} Songs`,
      "public": true,
      "description": "",
    }
    
    // Create a public, non-collaborative playlist on the user's profile.
    const playlistResponse = await axios.post(`${api_base_url}users/${userId}/playlists`, req_body, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      }
    });
  
    // Return playlist's Spotify ID.
    return playlistResponse.data.id;
  } catch (err) {
    console.log(err);
  }
}

async function addSongsToPlaylist(playlistId, songUris, accessToken) {
  const req_body = {
    uris: songUris,
  }

  try {
    // Add songs to playlist.
    await axios.post(`${api_base_url}playlists/${playlistId}/tracks`, req_body, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      }
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { searchSpotifySong, startPlayback, transferPlaybackHelper, /*toggleLoop, toggleShuffle*/ getNewPlaylistId, addSongsToPlaylist};
