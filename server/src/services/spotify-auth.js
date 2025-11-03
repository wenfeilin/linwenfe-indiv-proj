const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

/**
 * REPLACE COOKIE PARTS W/ SESSION LATER.
 */

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const auth_url = "https://accounts.spotify.com/authorize";
const token_url = "https://accounts.spotify.com/api/token";

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

// Prompts user to login with their Spotify credentials and to authorize access specified by the
// scopes. Then, the user gets redirected to the specified `redirect_uri`.
function getAuthorizationUrl(req, res) {
  // Generate a random string for the state for verification later.
  const state = generateRandomString(16);

  // Scopes for searching for songs, creating public playlists, and controlling playback of song; the last four scopes are for the Spotify Web Playback SDK.
  const scope = "user-read-private playlist-modify-public streaming user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing";

  const params = new URLSearchParams({
    client_id: client_id,
    response_type: "code",
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
    show_dialog: true, // keep for testing purposes; get rid of when deploying; this forces the Spotify login/authorization dialog to appear even if the user is already logged in and has authorized the app
  });

  // Build the authorization URl to redirect to to get an authorization code from.
  const authorizationUrl = `${auth_url}?${params.toString()}`;
  return {authorizationUrl, state};
}

async function getAccessTokenInfo(req, res) {
  // Check the code and state params from the URL returned from the authorization step.
  const auth_code = req.query.code || null;
  const state = req.query.state || null;

  const storedState = req.cookies ? req.cookies["spotify_auth_state"] : null;

  // Stop the authentication flow if there is a mismatch in the current and prev states for
  // security reasons.
  if (state === null || state !== storedState) {
    const params = new URLSearchParams({
      error: "state_mismatch",
    });

    // Go back to the original page.
    console.log("State mismatch.");
    return res.redirect(req.cookies["redirect_url"]);
  } else {
    // The request for an access token was valid.

    // Access was denied by user.
    if (!auth_code) {
      // Signal to FE that auth was denied by user in a search param in the URL.
      // const redirectUrl = new URL(req.cookies["redirect_url"]);
      // redirectUrl.searchParams.set("auth_denied", "true");
      
      // Go back to the original page.
      console.log("Access denied.");
      // // Clear all auth-related cookies
      // res.clearCookie('access_token');
      // res.clearCookie('refresh_token');
      // res.clearCookie('expires_at');
      // res.clearCookie('spotify_auth_state');
      // res.clearCookie('redirect_url');

      // return res.redirect(redirectUrl.toString());
      return res.redirect(req.cookies["redirect_url"]);
    } else {
      // Access was granted by user.
      const req_body = new URLSearchParams({
        grant_type: "authorization_code",
        code: auth_code,
        redirect_uri: redirect_uri,
      }).toString();

      const req_headers = {
        "Authorization": `Basic ${Buffer.from(
          client_id + ":" + client_secret
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };

      try {
        // Make POST request to retrieve access token by the exchanging authorization code.
        const response = await axios.post(token_url, req_body, { headers: req_headers });
        const token_info = response.data; // axios returns obj w/ data property, not .json method.

        return token_info;
      } catch (err) {
        console.log("Failed to get access token: ", err.message);
        return null;
      }
    }
  }
}

// Use the one (usually unchanging) refresh token to request new access token(s).
async function refreshToken(req, res) {
  const refresh_token = req.cookies["refresh_token"] || null;
  const expires_at = req.cookies["expires_at"] || null;
  const ms_in_one_sec = 1000;

  // Missing refresh token; login/authorize to get one
  if (!refresh_token) {
    return res.redirect("/login"); // ?
  }

  // Invalid expiration time; login/authorize to set one
  if (!expires_at || isNaN(expires_at)) {
    return res.redirect("/login");
  }

  // Only refresh the token if it has expired
  if (Math.floor(Date.now() / ms_in_one_sec) > expires_at) {
    const req_body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }).toString();
  
    const req_headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(
        client_id + ":" + client_secret
      ).toString("base64")}`,
    };
  
    try {
      const response = await axios.post(token_url, req_body, { headers: req_headers});
      const new_token_info = response.data;
  
      return new_token_info;
    } catch (err) {
      console.log("Failed to get new access token: ", err.message);
      return null;
    }
  } else {
    return { message: "Access token is still valid" };
  }
}

module.exports = { getAuthorizationUrl, getAccessTokenInfo, refreshToken }