const { getAuthorizationCode, getAccessToken, getRefreshToken } = require("../services/spotify");

// Contains the actual Spotify logic of redirecting for login, doing a POST request to get the 
// access token, and the logic for retrieving a refresh token = the business logic for all auth 
// routes.

function login(req, res) {
  
}