// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var path = require("path");
require("dotenv/config");

const app = express();

// Connect to DB
// mongoose.set("useUnifiedTopology", true);
// mongoose.set("useCreateIndex", true);
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
//   console.log("Connected to DB");
// });

app.use(bodyParser.json());

// Import Routes
// const usersRoute = require("./routes/users");

// app.use("/api/users/", usersRoute);

// allows the app to use any necessary folders
// app.use("/front-end", express.static(__dirname + "/front-end"));
// app.use("/static", express.static(__dirname + "/static"));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Success" }); //test
});

var port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
