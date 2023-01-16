const express = require("express");
const stationRouter = express.Router();
const stationsController = require("../controllers/stationsController");

stationRouter.route("/").get(stationsController.getStations);

module.exports = stationRouter;
