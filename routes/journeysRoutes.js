const express = require("express");
const journeyRouter = express.Router();
const journeysController = require("../controllers/journeysController");

journeyRouter
  .route("/")
  .get(journeysController.getJourneys)
  .post(journeysController.createJourneys);

module.exports = journeyRouter;
