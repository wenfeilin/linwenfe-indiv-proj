const { getAuthorizationCode, getAccessToken, getRefreshToken } = require("../services/spotify-auth");

// Contains the actual Spotify logic of redirecting for login, doing a POST request to get the 
// access token, and the logic for retrieving a refresh token = the business logic for all auth 
// routes.

// Redirects user to Spotify's login/authorization page.
function login(req, res) {
  getAuthorizationCode(req, res);
}

// Redirects user back to the app (after logging in) but now with an autorization code.
function callbackHandler(req, res) {
  getAccessToken(req, res);
}

function refreshTokenHandler(req, res) {
  getRefreshToken(req, res);
}

module.exports = {login, callbackHandler, refreshTokenHandler}