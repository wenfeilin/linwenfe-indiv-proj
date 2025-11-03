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
  // Save and the URL of the page that login was initiated from to redirect to after login.
  const redirectUrl = process.env.FRONTEND_URL + req.query.prevPage;
  res.cookie("redirect_url", redirectUrl);

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

  // User denied authorization/login or state mismatch
  if (!token_info || token_info.error) {
    return;
  }

  // Set cookies.
  res.cookie("access_token", token_info.access_token); // is in seconds
  
  const ms_in_one_sec = 1000;
  res.cookie(
    "expires_at",
    Math.floor(Date.now() / ms_in_one_sec) + token_info.expires_in // change to 5 for testing
  );
  res.cookie("refresh_token", token_info.refresh_token);

  // Redirect to the page that began the login/authorization flow.
  res.redirect(req.cookies["redirect_url"]);
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

  // Note: This only sets cookies in responses. Have to forward these from the responses to have them appear on the client-side.
  res.cookie("access_token", new_token_info.access_token);
  res.cookie("expires_at", Math.floor(Date.now() / ms_in_one_sec) + new_token_info.expires_in);



  console.log("new expiration", Math.floor(Date.now() / ms_in_one_sec) + new_token_info.expires_in);


  console.log("Retrieved new access token");
  res.status(200).json({ message: "Token has been successfully refreshed."});
}

module.exports = {getValidAccessToken, login, callbackHandler, refreshTokenHandler}