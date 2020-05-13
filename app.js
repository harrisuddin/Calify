const { google } = require("googleapis");
const express = require("express");
require("dotenv/config");
//const OAuth2Data = require("./google_key.json");

const app = express();

// const CLIENT_ID = OAuth2Data.client.id;
// const CLIENT_SECRET = OAuth2Data.client.secret;
// const REDIRECT_URL = OAuth2Data.client.redirect;

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

var authed = false;

app.get("/", (req, res) => {
  if (!authed) {
    // Generate an OAuth URL and redirect there
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile", "openid"],
    });
    //console.log(url);
    res.redirect(url);
  } else {
    // const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    // gmail.users.labels.list(
    //   {
    //     userId: "me",
    //   },
    //   (err, res) => {
    //     if (err) return console.log("The API returned an error: " + err);
    //     const labels = res.data.labels;
    //     if (labels.length) {
    //       console.log("Labels:");
    //       labels.forEach((label) => {
    //         console.log(`- ${label.name}`);
    //       });
    //     } else {
    //       console.log("No labels found.");
    //     }
    //   }
    // );
    // res.send("Logged in");
    var oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    oauth2.userinfo.v2.me.get(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        //console.log(res);
        res.send(result);
      }
    });
  }
});

app.get("/oauth2callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        console.log(tokens);
        oAuth2Client.setCredentials(tokens);
        authed = true;
        res.redirect("/");
      }
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at ${port}`));
