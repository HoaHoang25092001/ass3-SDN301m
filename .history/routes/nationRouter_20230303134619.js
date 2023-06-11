const express = require("express");
const nationRouter = express.Router();
const nationController = require("../controller/nationController");
// const { ensureAuthenticated } = require("../config/auth");
var { cookieAuthenticated } = require("../config/authenticated");

nationRouter
  .route("/")
  .get(nationController.index)
  .post(cookieAuthenticated, nationController.create);

nationRouter
  .route("/edit/:nationID")
  .get(cookieAuthenticated, nationController.edit)
  .post(cookieAuthenticated, nationController.update);

nationRouter
  .route("/delete/:nationID")
  .get(cookieAuthenticated, nationController.delete);

module.exports = nationRouter;
