require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const ConnectDB = require("./config/dbConnect");
//const { searchStation } = require("./controllers/stationController");
//const { searchJourney } = require("./controllers/journeyController");
const { searchJourney } = require("./controllers/journey2Controller");
const { searchStation } = require("./controllers/station2Controller")
const PORT = process.env.PORT || 3001;
const app = express();

console.log(process.env.NODE_ENV);
ConnectDB();

// Cors_ Cross origin resource sharing_ Security usage
app.use(cors(corsOptions));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** RESTFUL API */

// Home page
app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log(req.body);
});

//Autocomplete
app.get("/search", searchStation)

//Journeys
app.get("/journeys", searchJourney);

/** listen or Requests */
/** Connect to Mongo */
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
  logEvents(
    `${err.no}: §{err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.Log"
  );
});
