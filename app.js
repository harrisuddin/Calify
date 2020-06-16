const express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
var morgan = require("morgan");
// const { verifyJWT, generateJWT } = require("./static/auth");
// const jwt = require("jsonwebtoken");
var { User } = require("./models/user");
const mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
const GoogleWrapper = require("./classes/GoogleWrapper");
const SpotifyWrapper = require("./classes/SpotifyWrapper");
//const oauthRoute = require("./routes/oauth2callback");
require("dotenv/config");
const googleScope = "profile email openid https://www.googleapis.com/auth/calendar";
const spotifyScope = "user-read-recently-played user-read-email";
const responseType = "code";

let google = new GoogleWrapper(null, null, null, process.env.CLIENT_ID, process.env.CLIENT_SECRET, googleScope, responseType, null);
let spotify = new SpotifyWrapper(null, null, null, process.env.SPOT_CLIENT_ID, process.env.SPOT_CLIENT_SECRET, spotifyScope, responseType);

const app = express();

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser(process.env.COOKIE_SECRET));

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({ secret: process.env.COOKIE_SECRET, cookie: { maxAge: 300000 } })
);

// TASK: fix authentication
app.use((req, res, next) => {
  // const decoded = verifyJWT(req.cookies.user_jwt);
  // if (!decoded) {
  //   res.clearCookie('user_jwt');
  //   req.session.user = {test: "hi"};
  // } else {
  //   req.session.user = decoded;
  // }
  if (!req.session.user) {
    req.session.user = {};
  }

  next();
});

// TASK: less code duplication
/**
 * This handles the oauth callbacks from GOOG and SPOT
 * When this endpoint is hit, the code is retrieved from the get parameters and then used to get the
 * tokens from the APIs. Then the user is redirected back to the login/signup page for now   
 */
app.use("/oauth2callback", express.Router()
  .get("/google/login", async (req, res) => {

    const hls = await google.handleLoginSignup(req, process.env.REDIRECT_URL_LOGIN);
    if (hls.errorCode) return res.status(404).send("Error, something went wrong.");
    const url = process.env.URL + "/login";
    res.redirect(url);

  })
  .get("/google/signup", async (req, res) => {

    const hls = await google.handleLoginSignup(req, process.env.REDIRECT_URL_SIGNUP);
    if (hls.errorCode) return res.status(404).send("Error, something went wrong.");
    const url = process.env.URL + "/signup";
    res.redirect(url);

  })
  .get("/spotify/signup", async (req, res) => {

    const hls = await spotify.handleLoginSignup(req, process.env.SPOT_REDIRECT_URL_SIGNUP);
    if (hls.errorCode) return res.status(404).send("Error, something went wrong.");
    const url = process.env.URL + "/signup";
    res.redirect(url);

  })
);

app.get("/login", async (req, res) => {
  if (!req.session.user.google_email) {
    redirectGoogleLogin(res);
  } else {
    try {
      const { google_email, google_access_token, google_access_token_expiry, google_refresh_token } = req.session.user;
      let user = await User.findOne({ google_email });
      if (!user) return res.status(404).send("User not found");
      user = Object.assign(user, {google_access_token, google_access_token_expiry, google_refresh_token});
      user.save();
      req.session.user = { _id: user._id, google_email };
      res.send({google_email, google_access_token, google_access_token_expiry, google_refresh_token});
    } catch (err) {
      console.err(err);
      res.send("Error, something went wrong.");
    }
  }
});

// TASK: clean up
app.get("/signup", async (req, res) => {
  if (!req.session.user.google_access_token) {
    redirectGoogleSignUp(res);
  } else if (!req.session.user.spotify_access_token) {
    let user = await User.findOne({ google_email: req.session.user.google_email });
    if (user) return res.status(404).send("User already exists.");
    redirectSpotifySignUp(res);
  } else {
    const { google_access_token, google_email, google_refresh_token, spotify_access_token, spotify_refresh_token, spotify_email, google_access_token_expiry, spotify_access_token_expiry } = req.session.user;
    google.accessToken = google_access_token;
    // console.dir(google);
    const google_calendar_id = await google.setupSpotifyCalendar();
    if (google_calendar_id.errorCode) return res.status(404).send("Error, something went wrong.");
    user = new User({ google_access_token, google_email, google_refresh_token, spotify_access_token, spotify_refresh_token, spotify_email, spotify_access_token_expiry, google_access_token_expiry, google_calendar_id});
    try {
      await user.save();
      req.session.user = { _id: user._id, google_email };
      res.send({ google_access_token, google_email, google_refresh_token, spotify_access_token, spotify_refresh_token, spotify_email, google_access_token_expiry, spotify_access_token_expiry, google_calendar_id});
    } catch (err) {
      console.log(err);
      res.send("Error, something went wrong.");
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

// Redirect functions

function redirectGoogleLogin(res) {
  res.redirect(google.getOAuthURL(process.env.REDIRECT_URL_LOGIN));
}

function redirectGoogleSignUp(res) {
  res.redirect(google.getOAuthURL(process.env.REDIRECT_URL_SIGNUP));
}

function redirectSpotifySignUp(res) {
  res.redirect(spotify.getOAuthURL(process.env.SPOT_REDIRECT_URL_SIGNUP));
}

async function updateUsersCalendars() {
  for await (let user of User.find()) {
    let {_id, google_access_token, google_email, google_refresh_token, spotify_access_token, spotify_refresh_token, spotify_email, spotify_access_token_expiry, google_access_token_expiry, google_calendar_id} = user;

    // create the api wrappers for this specific user
    let userGoogleWrapper = new GoogleWrapper(google_access_token, google_refresh_token, google_access_token_expiry, process.env.CLIENT_ID, process.env.CLIENT_SECRET, googleScope, responseType, google_calendar_id);
    let userSpotifyWrapper = new SpotifyWrapper(spotify_access_token, spotify_refresh_token, spotify_access_token_expiry, process.env.SPOT_CLIENT_ID, process.env.SPOT_CLIENT_SECRET, spotifyScope, responseType);

    // validate the google and spotify tokens
    const validateGoogleToken = await userGoogleWrapper.validateAccessToken();
    if (validateGoogleToken.errorCode) continue;

    const validateSpotifyToken = await userSpotifyWrapper.validateAccessToken();
    if (validateSpotifyToken.errorCode) continue;

    // get the previous songs
    const json = await userSpotifyWrapper.getPreviousSongs();
    if (json.errorCode) continue;
    json.items.forEach(elem => {
      const song = userSpotifyWrapper.formatTrack(elem);
      const {title, artists, startTime, endTime} = song;
      // console.log({startTime, endTime, title, artists});
      userGoogleWrapper.addSongEvent(startTime, endTime, "UTC", title, artists);
    });
  }
}

// var job = new CronJob('* * * * * *', , null, true, "UTC");

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
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at ${port}`));
