const express = require("express");
const searchRouter = express.Router();
const searchController = require("../controllers/searchController");

searchRouter.route("/").get(searchController.getSearched);

module.exports = searchRouter;
