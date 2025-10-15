const axios = require("axios");
const {startPlayback, transferPlaybackHelper, toggleLoop, toggleShuffle} = require("../services/spotify-api")

async function playSong(req, res) {
  // Pass as payload in request sent from FE.
  const { device_id, uris } = req.body;
  const accessToken = req.cookies["access_token"];

  try {
    const response = await startPlayback(device_id, uris, accessToken);

    // console.log("Play song response", response);

    if (response.status === 204) {
      console.log("Night before the end should be playing.")
      res.sendStatus(204); // Playback started.
    } else {
      console.log("Status 400")
      res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
  }
}

async function transferPlayback(req, res) {
  // Pass as payload in request sent from FE.
  const {device_ids} = req.body;
  const accessToken = req.cookies["access_token"];

  try {
    const response = await transferPlaybackHelper(device_ids, accessToken);

    // console.log("Transfer playback response", response);
    if (response.status === 204) {
      res.sendStatus(204); // Playback started.
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
  }

}

// async function loop(req, res) {
//   // Pass as payload in request sent from FE.
//   const state;
//   const device_id;

//   const accessToken = req.cookies["access_token"];

//   try {
//     const response = await toggleLoop(state, device_id, accessToken);

//     if (!response) {
//       res.status(204); // Playback started.
//     } else {
//       res.status(400);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// } 

// async function shuffleSongs(req, res) {
//   // Pass as payload in request sent from FE.
//   const state;
//   const device_id;

//   const accessToken = req.cookies["access_token"];

//   try {
//     const response = await toggleShuffle(state, device_id, accessToken);

//     if (!response) {
//       res.status(204); // Playback started.
//     } else {
//       res.status(400);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = { playSong, transferPlayback/*, loop, shuffleSongs*/ };
