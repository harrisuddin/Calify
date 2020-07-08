const express = require("express");
var cookieParser = require("cookie-parser");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var morgan = require("morgan");
const path = require("path");
// const { verifyJWT, generateJWT } = require("./static/auth");
// const jwt = require("jsonwebtoken");
const { sleep } = require("./static/helper");
var { User } = require("./models/user");
const mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
const GoogleWrapper = require("./classes/GoogleWrapper");
const SpotifyWrapper = require("./classes/SpotifyWrapper");
require("dotenv/config");
const googleScope =
  "profile email openid https://www.googleapis.com/auth/calendar";
const spotifyScope = "user-read-recently-played user-read-email";
const responseType = "code";

/**
 * TASKS:
 * Create static functions for redirecting to urls x
 * Add comments all round x
 * Create /api endpoint to check if user is logged in
 * Edit classes so they don't require responseType, scope, etc as args x
 * Edit classes so they check obj has methods that it is calling x
 * Encrypt access/refresh tokens in db
 * Create getReqWithAT and postReqWithAT x
 */

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser(process.env.COOKIE_SECRET));

// set morgan to log info about our requests for development use.
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    name: "sci-session",
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: 300000 },
  })
);

// TASK: fix authentication
app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = {};
  }
  next();
});

// Create instantiations of the GoogleWrapper and SpotifyWrapper classes
let google = new GoogleWrapper(
  null,
  null,
  null,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  null
);
let spotify = new SpotifyWrapper(
  null,
  null,
  null,
  process.env.SPOT_CLIENT_ID,
  process.env.SPOT_CLIENT_SECRET
);

// Create helper objects for the /oauth2callback endpoint below
const apiWrappers = {
  spotify: spotify,
  google: google,
};
const redirectURLs = {
  "google login": process.env.REDIRECT_URL_LOGIN,
  "google signup": process.env.REDIRECT_URL_SIGNUP,
  "spotify signup": process.env.SPOT_REDIRECT_URL_SIGNUP,
};

// Redirect functions
function redirectGoogleLogin(res) {
  res.redirect(
    GoogleWrapper.getOAuthURL(
      process.env.REDIRECT_URL_LOGIN,
      process.env.CLIENT_ID,
      googleScope,
      responseType
    )
  );
}
function redirectGoogleSignUp(res) {
  res.redirect(
    GoogleWrapper.getOAuthURL(
      process.env.REDIRECT_URL_SIGNUP,
      process.env.CLIENT_ID,
      googleScope,
      responseType
    )
  );
}
function redirectSpotifySignUp(res) {
  res.redirect(
    SpotifyWrapper.getOAuthURL(
      process.env.SPOT_REDIRECT_URL_SIGNUP,
      process.env.SPOT_CLIENT_ID,
      spotifyScope,
      responseType
    )
  );
}

/**
 * This handles the oauth callbacks from GOOG and SPOT
 * When this endpoint is hit, the code is retrieved from the get parameters and then used to get the
 * tokens from the APIs. Then the user is redirected back to the login/signup endpoint
 */
app.get("/oauth2callback/:service/:action", async (req, res) => {
  const { service = "", action = "" } = req.params;

  // if the service and/or action is invalid
  // then send an error
  if (
    !apiWrappers[service] ||
    !(action === "login" || action === "signup") ||
    (service === "spotify" && action === "login")
  ) {
    console.error(apiWrappers[service], action, service);
    return res.status(404).send("Error, something went wrong.");
  }

  const hls = await apiWrappers[service].handleLoginSignup(
    req,
    redirectURLs[service + " " + action]
  );
  if (hls.errorCode) {
    console.error(hls);
    return res.status(404).send("Error, something went wrong.");
  }

  // after getting the details for a specific API service, redirect the user back to the login or signup endpoint 
  const url = process.env.URL + "/api/" + action;
  res.redirect(url);
});

/**
 * If the user doesn't have the Google credentials (access/refresh token etc)
 * then redirect them to sign in with Google.
 * If they have the Google credentials, check they exist in db, save the latest tokens, and set their session variables.
 */
app.get("/api/login", async (req, res) => {
  const {
    google_email,
    google_access_token,
    google_access_token_expiry,
    google_refresh_token,
  } = req.session.user;
  if (
    !(
      google_email &&
      google_access_token &&
      google_access_token_expiry &&
      google_refresh_token
    )
  ) {
    redirectGoogleLogin(res);
  } else {
    try {
      let user = await User.findOne({ google_email });
      if (!user) {
        req.session.user = null;
        return res.status(404).send("User not found");
      }
      user = Object.assign(user, {
        google_access_token,
        google_access_token_expiry,
        google_refresh_token,
      });
      user.save();
      req.session.user = { _id: user._id, google_email };
      res.send({
        google_email,
        google_access_token,
        google_access_token_expiry,
        google_refresh_token,
      });
    } catch (err) {
      console.error(err);
      req.session.user = null;
      res.status(404).send("Error, something went wrong.");
    }
  }
});

/**
 * If the user doesn't have the Google and/or Spotify credentials (access/refresh token etc)
 * then redirect them to sign in with Google and/or Spotify.
 * If they have the Google and Spotify credentials, add their details to the db, and set their session variables.
 */
app.get("/api/signup", async (req, res) => {
  let user = null;
  const {
    google_access_token,
    google_email,
    google_refresh_token,
    spotify_access_token,
    spotify_refresh_token,
    spotify_email,
    google_access_token_expiry,
    spotify_access_token_expiry,
  } = req.session.user;
  if (
    !(
      google_email &&
      google_access_token &&
      google_access_token_expiry &&
      google_refresh_token
    )
  ) {
    redirectGoogleSignUp(res);
  } else if (
    !(
      spotify_email &&
      spotify_access_token &&
      spotify_access_token_expiry &&
      spotify_refresh_token
    )
  ) {
    user = await User.findOne({ google_email });
    if (user) {
      req.session.user = null;
      return res
        .status(404)
        .send("This google email address is taken, please try again.");
    }
    redirectSpotifySignUp(res);
  } else {
    user = await User.findOne({ spotify_email });
    if (user) {
      req.session.user = null;
      return res
        .status(404)
        .send("This spotify email address is taken, please try again.");
    }
    google.accessToken = google_access_token;
    const google_calendar_id = await google.setupSpotifyCalendar();
    if (google_calendar_id.errorCode) {
      console.error(google_calendar_id);
      req.session.user = null;
      return res.status(404).send("Error, something went wrong.");
    }
    user = new User({
      google_access_token,
      google_email,
      google_refresh_token,
      spotify_access_token,
      spotify_refresh_token,
      spotify_email,
      spotify_access_token_expiry,
      google_access_token_expiry,
      google_calendar_id,
    });
    try {
      await user.save();
      req.session.user = { _id: user._id, google_email };
      res.send({
        google_access_token,
        google_email,
        google_refresh_token,
        spotify_access_token,
        spotify_refresh_token,
        spotify_email,
        google_access_token_expiry,
        spotify_access_token_expiry,
        google_calendar_id,
      });
    } catch (err) {
      console.error(err);
      req.session.user = null;
      res.status(404).send("Error, something went wrong.");
    }
  }
});

// for testing
app.get("/session", (req, res) => {
  res.send(req.session.user);
});

app.get("/test", async (req, res) => {
  await updateUsersCalendars();
  res.send("hi");
});

async function updateUsersCalendars() {
  for await (let user of User.find()) {
    let {
      _id,
      google_access_token,
      google_email,
      google_refresh_token,
      spotify_access_token,
      spotify_refresh_token,
      spotify_email,
      spotify_access_token_expiry,
      google_access_token_expiry,
      google_calendar_id,
    } = user;

    // create the api wrappers for this specific user
    let userGoogleWrapper = new GoogleWrapper(
      google_access_token,
      google_refresh_token,
      google_access_token_expiry,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      googleScope,
      responseType,
      google_calendar_id
    );
    let userSpotifyWrapper = new SpotifyWrapper(
      spotify_access_token,
      spotify_refresh_token,
      spotify_access_token_expiry,
      process.env.SPOT_CLIENT_ID,
      process.env.SPOT_CLIENT_SECRET,
      spotifyScope,
      responseType
    );

    // validate the google and spotify tokens
    const validateGoogleToken = await userGoogleWrapper.validateAccessToken();
    if (validateGoogleToken.errorCode) continue;

    const validateSpotifyToken = await userSpotifyWrapper.validateAccessToken();
    if (validateSpotifyToken.errorCode) continue;

    // get the previous songs
    let previousSongs = await userSpotifyWrapper.getPreviousSongs();
    if (previousSongs.errorCode != 429) continue;

    // If there is rate-limiting, the retry-after header in the request
    // will contain the number of seconds needed to wait before making another request.
    if (previousSongs.errorCode == 429) {
      console.log("about to sleep...");
      const sleepTime = previousSongs.headers.get("retry-after") * 1000;
      await sleep(sleepTime);
      previousSongs = await userSpotifyWrapper.getPreviousSongs();
      if (previousSongs.errorCode) {
        console.error(previousSongs);
        continue;
      }
    }

    previousSongs.items.forEach((elem) => {
      const song = SpotifyWrapper.formatTrack(elem);
      const { title, artists, startTime, endTime } = song;
      console.log({ startTime, endTime, title, artists });
      userGoogleWrapper.addSongEvent(startTime, endTime, "UTC", title, artists);
    });
  }
}

//var job = new CronJob('* * * * * *', updateUsersCalendars, null, true, "UTC");

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// Connect to DB
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("Connected to DB");
});

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at ${port}`));
