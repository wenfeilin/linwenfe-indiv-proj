// Checks if access token is valid (exists and hasn't expired)
function isAccessTokenValid(req) {
  const accessToken = req.cookies ? req.cookies["access_token"] : null;
  const expiresAt = req.cookies ? req.cookies["expires_at"] : null;
  const msInOneSecond = 1000;
  const nowInSeconds = Math.floor(Date.now() / msInOneSecond);

  return accessToken && nowInSeconds < expiresAt;
}

// Refreshes access token if necessary
function checkAccessToken(req, res, next) {
  // Only refresh the access token if it is expired or doesn't exist
  console.log("Is access token still valid? ", isAccessTokenValid(req))
  if (isAccessTokenValid(req)) {
    console.log("Token is valid.")
    next();
  } else {
    console.log("Going to retrieve new access token");





    // USING REDIRECT HERE DOES NOT CHANGE THE REQUEST TO GET; THAT'S WHY THERE'S AN ERROR IN THE TERMINAL



    res.redirect("/auth/refresh");
    // try {
    //   // Call your refreshToken service directly
    //   const newTokenInfo = await refreshToken(req, res);
    //   // Set new cookies if needed
    //   res.cookie("access_token", newTokenInfo.access_token);
    //   res.cookie("expires_at", newTokenInfo.expires_at);
    //   next();
    // } catch (err) {
    //   console.log(err);
    //   res.status(401).json({ error: "Unable to refresh token" });
    // }
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
    res.status(401).json({ isLoggedIn: false });
  }
}

module.exports = { checkAccessToken, checkLoginStatus };