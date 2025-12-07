const axios = require("axios");

// Checks if access token is valid (exists and hasn't expired)
function isAccessTokenValid(req) {
  // const isAccessDenied = req.cookies ? req.cookies["access_denied"] : true;
  // if (!isAccessDenied) {
    const accessToken = req.cookies ? req.cookies["access_token"] : null;
    const expiresAt = req.cookies ? +req.cookies["expires_at"] : null;
    const msInOneSecond = 1000;
    const nowInSeconds = Math.floor(Date.now() / msInOneSecond);
  
    return accessToken && nowInSeconds < expiresAt;
  // }

  // return false;
}

// Refreshes access token if necessary
async function checkAccessToken(req, res, next) {
  // Only refresh the access token if it is expired or doesn't exist
  console.log("Is access token still valid? ", isAccessTokenValid(req))
  if (isAccessTokenValid(req)) {
    console.log("Token is valid.");
    next();
  } else {
    console.log("Going to retrieve new access token");

    const backendUrl = process.env.BACKEND_URL;

    try {
      const response = await axios.get(`${backendUrl}/auth/refresh`, {
        headers: {
          Cookie: req.headers.cookie, // Forwards cookies since making a req from the BE to a route
      }});

      // Forwards cookies from response to client. The server sends a Set-Cookie header in its response to the client. The client stores this cookie to the Cookie header?
      const setCookieHeader = response.headers["set-cookie"];
      res.setHeader("Set-Cookie", setCookieHeader);

      // Proceed to next route handler
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Failed to refresh token"});
    }
  }
}

// Checks if user has logged in and authorized access or not 
function checkLoginStatus(req, res, next) {
  // If the user has already logged in, has authorized access, and doesn't have an expired access 
  // token, prevent them from logging in again.
  // console.log(isAccessTokenValid());
  if (isAccessTokenValid(req)) {
    // Already logged in, authorized access, and has unexpired access token
    res.status(200).json({ isLoggedIn: true });
  } else {
    // Not logged in, denied access, or has expired access token.
    res.status(200).json({ isLoggedIn: false });
  }
}

module.exports = { checkAccessToken, checkLoginStatus };