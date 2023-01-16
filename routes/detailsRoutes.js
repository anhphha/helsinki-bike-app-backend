const express = require("express");
const detailsRouter = express.Router();
const detailsController = require("../controllers/detailsController");

detailsRouter.route("/").get(detailsController.getDetails);

module.exports = detailsRouter;
