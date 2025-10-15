const { getAuthorizationUrl, getAccessTokenInfo, refreshToken } = require("../services/spotify-auth");

// Contains the actual Spotify logic of redirecting for login, doing a POST request to get the 
// access token, and the logic for retrieving a refresh token = the business logic for all auth 
// routes.

function getValidAccessToken(req, res) {
  // Retrieve access token from cookies.
  const access_token = req.cookies? req.cookies["access_token"] : null;
  console.log("Returning the supposedly valid token.")
  res.json({access_token: access_token});
}

// Redirects user to Spotify's login/authorization page.
function login(req, res) { 
  // Get the URL for user authorization.
  const {authorizationUrl, state} = getAuthorizationUrl(req, res);

  // Set the state as a cookie to verify with when requesting an access token.
  res.cookie("spotify_auth_state", state);

  // Redirect user to Spotify login (and authorization) page.
  res.redirect(authorizationUrl);
}

// Redirects user back to the app (after logging in) and requests an access token.
async function callbackHandler(req, res) {
  const token_info = await getAccessTokenInfo(req, res);

  // 400 = Bad Request
  if (!token_info) {
    return res.status(400).json({ error: "Failed to get access token" });
  }

  // Set cookies.
  res.cookie("access_token", token_info.access_token); // is in seconds
  
  const ms_in_one_sec = 1000;
  res.cookie(
    "expires_at",
    Math.floor(Date.now() / ms_in_one_sec) + token_info.expires_in // change to 5 for testing
  );
  res.cookie("refresh_token", token_info.refresh_token);

  // Redirect to home page for now. (Ideally, want to redirect to the page that began the
  // login/authorization flow!)
  const homepage_URL = process.env.FRONTEND_URL;
  res.redirect(homepage_URL);
}

async function refreshTokenHandler(req, res) {
  const new_token_info = await refreshToken(req, res);

  // 500 = Server-side error
  if (!new_token_info) {
    return res.status(500).json({ error: "Failed to get access token" });
  }

  // Access token is still valid, so no need to refresh it.
  if (new_token_info.message) {
    return res.status(200).json(new_token_info);
  }

  // Sets new values of existing cookies.
  const ms_in_one_sec = 1000;

  res.cookie("access_token", new_token_info.access_token);
  res.cookie("expires_at", Math.floor(Date.now() / ms_in_one_sec) + new_token_info.expires_in);
  res.cookie("refresh_token", new_token_info.refresh_token);

  // Redirect to home page for now. (Ideally, want to redirect to the page that began the
  // login/authorization flow!)

  console.log("Retrieved new access token");

  res.redirect("/");
}

module.exports = {getValidAccessToken, login, callbackHandler, refreshTokenHandler}