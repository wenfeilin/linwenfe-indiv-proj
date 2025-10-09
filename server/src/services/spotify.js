const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

/**
 * REPLACE COOKIE PARTS W/ SESSION LATER.
 */

const router = express.Router();
router.use(cookieParser());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const auth_url = "https://accounts.spotify.com/authorize";
const token_url = "https://accounts.spotify.com/api/token";
const api_base_url = "https://api.spotify.com/v1/";

const stateKey = "spotify_auth_state";

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

// Prompts user to login with their Spotify credentials and to authorize access specified by the
// scopes. Then, the user gets redirected to the specified `redirect_uri`.
export async function getAuthorizationCode(req, res, next) {
  // Generate a random string for the state for verification later.
  const state = generateRandomString(16);
  // Set the state as a cookie to verify with when requesting an access token.
  res.cookie(stateKey, state);

  // Scopes for searching for songs, creating public playlists, and controlling playback of song.
  const scope = "user-read-private playlist-modify-public streaming";

  const params = new URLSearchParams({
    client_id: client_id,
    response_type: "code",
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
    show_dialog: true, // keep for testing purposes; get rid of when deploying
  });

  // Redirect user to Spotify login (and authorization) page.
  res.redirect(`${auth_url}?${params.toString()}`);
}

export async function getAccessToken(req, res) {
  // Check the code and state params from the URL returned from the authorization step.
  const code = req.query.code || null;
  const state = req.query.state || null;

  const storedState = req.cookies ? req.cookies[stateKey] : null;

  // Stop the authentication flow if there is a mismatch in the current and prev states for
  // security reasons.
  if (state === null || state !== storedState) {
    const params = new URLSearchParams({
      error: "state_mismatch",
    });

    res.redirect(`/#${params.toString()}`);
  } else {
    // The request for an access token was valid.

    // Access was denied by user.
    if (!code) {
      return res.status(400).json({ error: req.query.error });
    } else {
      // Access was granted by user.
      const req_body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
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

        const ms_in_one_sec = 1000;

        // Sets cookies.
        res.cookie("access_token", token_info.access_token);
        res.cookie(
          "expires_at",
          Math.floor(Date.now() / ms_in_one_sec) + token_info.expires_in
        );
        res.cookie("refresh_token", token_info.refresh_token);

        // Redirect to home page for now. (Ideally, want to redirect to the page that began the
        // login/authorization flow!)
        res.redirect("/");
      } catch {
        res.status(500).json({ error: "Failed to get access token" });
      }
    }
  }
}

export async function getRefreshToken(req, res) {
  const refresh_token = req.cookies["refresh_token"] || null;
  const expires_at = req.cookies("expires_at") || null;
  const ms_in_one_sec = 1000;

  // Missing refresh token
  if (!refresh_token) {
    return res.redirect("/login"); // ?
  }

  // Invalid expiration time
  if (!expires_at || isNaN(expires_at)) {
    return res.redirect("/login");
  }

  if (Math.floor(Date.now() / ms_in_one_sec) > req.cookies["expires_at"]) {
    const req_body = {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    };
  
    const req_headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(
        client_id + ":" + client_secret
      ).toString("base64")}`,
    };
  
    try {
      const response = await axios.post(token_url, req_body, { headers: req_headers});
      const new_token_info = response.data;
  
      // Sets new values of existing cookies.
      res.cookie("access_token", new_token_info.access_token);
      res.cookie("expires_at", Math.floor(Date.now() / ms_in_one_sec) + new_token_info.expires_in);
      res.cookie("refresh_token", new_token_info.refresh_token);
  
      // Redirect to home page for now. (Ideally, want to redirect to the page that began the
      // login/authorization flow!)
      res.redirect("/");
    } catch {
      res.status(500).json({ error: "Failed to get access token" });
    }
  }
}
