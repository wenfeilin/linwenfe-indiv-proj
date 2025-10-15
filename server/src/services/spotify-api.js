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
    `${api_base_url}search?${params.toString()}`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  ); // already parsed as JS object from JSON by axios
  return response.data;
}

const api_base_player_url = "https://api.spotify.com/v1/" + "me/player/";

async function startPlayback(device_id, songUris, accessToken) {
  // PUT /me/player/play
  const req_body = {
    // device_id: device_id,
    uris: songUris,
    position_ms: 0, // start playing from beginning of song for now
  };

  console.log(device_id);
  console.log(songUris);

  try {
    console.log("Trying to request for playback to start for Night before the end");
    const response = await axios.put(`${api_base_player_url}play?device_id=${device_id}`, req_body, {
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

// state = "track", "context", "off"
async function toggleLoop(state, device_id, accessToken) {
  // PUT /me/player/repeat
  try {
    const response = await axios.put(`${api_base_player_url}repeat?state=${state}&device_id=${device_id}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    return response;
  } catch (err) {
    console.log(err);
  }
}

async function toggleShuffle(state, device_id, accessToken) {
  // PUT /me/player/shuffle
  try {
    const response = await axios.put(`${api_base_player_url}shuffle?state=${state}&device_id=${device_id}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    
    return response;
  } catch (err) {
    console.log(err)
  }
}

module.exports = { searchSpotifySong, startPlayback, transferPlaybackHelper, toggleLoop, toggleShuffle};
