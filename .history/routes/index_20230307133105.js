var express = require("express");
var router = express.Router();

const Player = require("../models/player");
const Nation = require("../models/nation");

var jwt = require("jsonwebtoken");
const config = require("../config/config");

let clubData = [
  { id: "1", name: "Arsenal" },
  { id: "2", name: "Manchester United" },
  { id: "3", name: "Chelsea" },
  { id: "4", name: "Manchester City" },
  { id: "5", name: "PSG" },
  { id: "6", name: "Inter Milan" },
  { id: "7", name: "Real Madrid" },
  { id: "8", name: "Barcelona" },
];

let isCaptain = [
  { id: "1", name: "Captain" },
  { id: "2", name: "Not Captain" },
];

let positionList = [
  { id: "1", name: "GK" },
  { id: "2", name: "RB" },
  { id: "3", name: "CB" },
  { id: "4", name: "LB" },
  { id: "5", name: "CDM" },
  { id: "6", name: "CM" },
  { id: "7", name: "CAM" },
  { id: "8", name: "RW" },
  { id: "9", name: "LW" },
  { id: "10", name: "ST" },
];

const errMessage = "Player name already exist!";
const authMessage = "Only Admin can do this action!";

/* GET home page. */
router.get("/", function (req, res, next) {
  var token = req.cookies.accessToken;
    let nationList = [];
    Nation.find({}, function (err, nations) {
      if (err) {
        console.error(err);
        return;
      }
      nations.forEach(function (nation) {
        nationList.push(nation);
      });
    });
    if (token) {
      var data = jwt.verify(req.cookies.accessToken, config.secretKey);
      if (data.user.isAdmin) {
        Player.find({})
          .populate("nation")
          .then((player) => {
            res.render("index", {
              title: "The list of Players",
              players: player,
              clubList: clubData,
              isCaptainList: isCaptain,
              message: "",
              checkAdmin: true,
              positions: positionList,
              nations: nationList,
            });
          })
          .catch(next);
      } else {
        Player.find({})
          .then((player) => {
            res.render("index", {
              title: "The list of Players",
              players: player,
              clubList: clubData,
              isCaptainList: isCaptain,
              message: "",
              checkAdmin: false,
              positions: positionList,
              nations: nationList,
            });
          })
          .catch(next);
      }
    } else {
      Player.find({})
        .then((player) => {
          res.render("index", {
            title: "The list of Players",
            players: player,
            clubList: clubData,
            isCaptainList: isCaptain,
            message: "",
            checkAdmin: false,
            positions: positionList,
            nations: nationList,
          });
        })
        .catch(next);
    }
});

module.exports = router;
