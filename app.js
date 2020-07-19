const express = require("express");
var cookieParser = require("cookie-parser");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var morgan = require("morgan");
const path = require("path");
const { decrypt, encrypt } = require("./static/auth");
const { sleep, getURLWithParams } = require("./static/helper");
var { User } = require("./models/user");
const mongoose = require("mongoose");
// eslint-disable-next-line no-unused-vars
var CronJob = require("cron").CronJob;
const GoogleWrapper = require("./classes/GoogleWrapper");
const SpotifyWrapper = require("./classes/SpotifyWrapper");
require("dotenv/config");
const googleScope =
  "profile email openid https://www.googleapis.com/auth/calendar";
const spotifyScope = "user-read-recently-played user-read-email";
const responseType = "code";
const {COOKIE_SECRET, URL, GOOG_CLIENT_ID, GOOG_CLIENT_SECRET, SPOT_CLIENT_ID, SPOT_CLIENT_SECRET, GOOG_REDIRECT_URL_SIGNUP, GOOG_REDIRECT_URL_LOGIN, SPOT_REDIRECT_URL_SIGNUP} = process.env;

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser(COOKIE_SECRET));

// set morgan to log info about our requests for development use.
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    name: "sci-session",
    secret: COOKIE_SECRET,
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

// if the session variables contain the users id and google email
// then let them go to the requested page
// if they don't, redirect them to home page 
function isLoggedIn(req, res, next) {
  if (req.session.user._id && req.session.user.google_email) {
    next();
  } else {
    res.redirect(URL);
  }
}

// test
app.use('/secret', isLoggedIn, (req, res) => {
  res.json("u made it");
});

// Create instantiations of the GoogleWrapper and SpotifyWrapper classes
let google = new GoogleWrapper(
  null,
  null,
  null,
  GOOG_CLIENT_ID,
  GOOG_CLIENT_SECRET,
  null
);
let spotify = new SpotifyWrapper(
  null,
  null,
  null,
  SPOT_CLIENT_ID,
  SPOT_CLIENT_SECRET
);

// Create helper objects for the /oauth2callback endpoint below
const apiWrappers = {
  spotify: spotify,
  google: google,
};
const redirectURLs = {
  "google login": GOOG_REDIRECT_URL_LOGIN,
  "google signup": GOOG_REDIRECT_URL_SIGNUP,
  "spotify signup": SPOT_REDIRECT_URL_SIGNUP,
};

// Redirect functions
function redirectGoogleLogin(res) {
  res.redirect(
    GoogleWrapper.getOAuthURL(
      GOOG_REDIRECT_URL_LOGIN,
      GOOG_CLIENT_ID,
      googleScope,
      responseType
    )
  );
}
function redirectGoogleSignUp(res) {
  res.redirect(
    GoogleWrapper.getOAuthURL(
      GOOG_REDIRECT_URL_SIGNUP,
      GOOG_CLIENT_ID,
      googleScope,
      responseType
    )
  );
}
function redirectSpotifySignUp(res) {
  res.redirect(
    SpotifyWrapper.getOAuthURL(
      SPOT_REDIRECT_URL_SIGNUP,
      SPOT_CLIENT_ID,
      spotifyScope,
      responseType
    )
  );
}
function redirectErrorPage(res, e) {
  res.redirect(getURLWithParams(URL + '/error', {e}));
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
    return redirectErrorPage(res, "Error, something went wrong");//res.status(404).send("Error, something went wrong.");
  }

  const hls = await apiWrappers[service].handleLoginSignup(
    req,
    redirectURLs[service + " " + action]
  );
  if (hls.errorCode) {
    console.error(hls);
    return redirectErrorPage(res, "Error, something went wrong");
  }

  // after getting the details for a specific API service, redirect the user back to the login or signup endpoint 
  const url = URL + "/api/" + action;
  console.log(url);
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
        return redirectErrorPage(res, "Sorry, we couldn't find this user, please sign up for an account");
      }
      let { _id } = user;
      user.google_refresh_token = encrypt(google_refresh_token, _id.toString());
      user.save();
      req.session.user = {_id, google_email };
      res.send({
        google_email,
        google_access_token,
        google_access_token_expiry,
        google_refresh_token,
      });
    } catch (err) {
      console.error(err);
      req.session.user = null;
      return redirectErrorPage(res, "Error, something went wrong");
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
      return redirectErrorPage(res, "Sorry, this Google account is taken, please sign up with a different Google account");
    }
    redirectSpotifySignUp(res);
  } else {
    user = await User.findOne({ spotify_email });
    if (user) {
      req.session.user = null;
      return redirectErrorPage(res, "Sorry, this Spotify account is taken, please sign up with a different Spotify account");
    }
    google.accessToken = google_access_token;
    const google_calendar_id = await google.setupSpotifyCalendar();
    if (google_calendar_id.errorCode) {
      console.error(google_calendar_id);
      req.session.user = null;
      return redirectErrorPage(res, "Error, something went wrong")
    }
    user = new User({
      google_email,
      google_refresh_token,
      spotify_refresh_token,
      spotify_email,
      google_calendar_id
    });
    try {
      let { _id } = user;
      user = Object.assign(user, {
        google_refresh_token: encrypt(google_refresh_token, _id.toString()),
        spotify_refresh_token: encrypt(spotify_refresh_token, _id.toString()),
      });
      await user.save();
      req.session.user = { _id, google_email };
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
      return redirectErrorPage(res, "Error, something went wrong");
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

async function updateCalendar(user) {
  let {
    google_refresh_token,
    spotify_refresh_token,
    google_calendar_id,
    calendar_last_updated, 
    _id
  } = user;

  let google_refresh_t = decrypt(google_refresh_token, _id.toString());
  let spotify_refresh_t = decrypt(spotify_refresh_token, _id.toString());
  
  // create the api wrappers for this specific user
  let userGoogleWrapper = new GoogleWrapper(
    null,
    google_refresh_t,
    null,
    GOOG_CLIENT_ID,
    GOOG_CLIENT_SECRET,
    google_calendar_id
  );
  let userSpotifyWrapper = new SpotifyWrapper(
    null,
    spotify_refresh_t,
    null,
    SPOT_CLIENT_ID,
    SPOT_CLIENT_SECRET
  );

  // validate the google and spotify tokens
  const validateGoogleToken = await userGoogleWrapper.validateAccessToken();
  if (validateGoogleToken.errorCode) return validateGoogleToken;

  const validateSpotifyToken = await userSpotifyWrapper.validateAccessToken();
  if (validateSpotifyToken.errorCode) return validateSpotifyToken;

  // get the previous songs
  let previousSongs = await userSpotifyWrapper.getPreviousSongs(calendar_last_updated);
  if (previousSongs.errorCode && previousSongs.errorCode != 429) return previousSongs;

  // If there is rate-limiting, the retry-after header in the request
  // will contain the number of seconds needed to wait before making another request.
  if (previousSongs.errorCode && previousSongs.errorCode == 429) {
    console.log("about to sleep...");
    const sleepTime = previousSongs.headers.get("retry-after") * 1000;
    await sleep(sleepTime);
    previousSongs = await userSpotifyWrapper.getPreviousSongs(calendar_last_updated);
    if (previousSongs.errorCode) {
      console.error(previousSongs);
      return previousSongs;
    }
  }

  previousSongs.items.forEach((elem) => {
    const { title, artists, startTime, endTime } = SpotifyWrapper.formatTrack(elem);
    console.log({ startTime, endTime, title, artists });
    userGoogleWrapper.addSongEvent(startTime, endTime, "UTC", title, artists);
  });

  user.calendar_last_updated = Date.now();
  try {
    user.save();
  } catch (e) {
    console.error(e);
  }
}

async function updateUsersCalendars() {
  for await (let user of User.find()) {
    const updateUserCalendar = await updateCalendar(user);
    if (updateUserCalendar && updateUserCalendar.errorCode) continue;
  }
}

//var job = new CronJob('* * * * * *', updateUsersCalendars, null, true, "UTC");

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// route for handling 404 requests(unavailable routes)
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
  redirectErrorPage(res, "Sorry, couldn't find that page");
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
