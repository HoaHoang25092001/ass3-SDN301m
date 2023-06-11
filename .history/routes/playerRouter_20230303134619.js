const express = require("express");
const playerRouter = express.Router();
const playerController = require("../controller/playerController");
// const { ensureAuthenticated } = require("../config/auth");
var { cookieAuthenticated } = require("../config/authenticated");

playerRouter
  .route("/")
  .get(playerController.index)
  .post(cookieAuthenticated, playerController.create);

playerRouter
  .route("/edit/:playerID")
  .get(cookieAuthenticated, playerController.edit)
  .post(cookieAuthenticated, playerController.update);

playerRouter
  .route("/delete/:playerID")
  .get(cookieAuthenticated, playerController.delete);

playerRouter.route("/details/:playerID").get(playerController.details);

module.exports = playerRouter;
