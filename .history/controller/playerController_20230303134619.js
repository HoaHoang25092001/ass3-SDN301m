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

class playerController {
  index(req, res, next) {
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
            res.render("player", {
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
            res.render("player", {
              title: "The list of Players",
              players: player,
              clubList: clubData,
              isCaptainList: isCaptain,
              message: "",
              checkAdmin: false,
              positions: positionList,
            });
          })
          .catch(next);
      }
    } else {
      Player.find({})
        .then((player) => {
          res.render("player", {
            title: "The list of Players",
            players: player,
            clubList: clubData,
            isCaptainList: isCaptain,
            message: "",
            checkAdmin: false,
            positions: positionList,
          });
        })
        .catch(next);
    }
  }

  create(req, res, next) {
    const newPlayer = new Player(req.body);
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
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
    if (data.user.isAdmin) {
      if (newPlayer.goals > 0) {
        newPlayer
          .save()
          .then(() => {
            res.redirect("/players");
          })
          .catch(() => {
            Player.find({})
              .then((player) => {
                res.render("player", {
                  title: "The list of Players",
                  players: player,
                  clubList: clubData,
                  isCaptainList: isCaptain,
                  error: "Name already exist!",
                  checkAdmin: true,
                  nations: nationList,
                  positions: positionList,
                });
              })
              .catch(next);
          });
      } else {
        req.flash("error_msg", "Goals must lager than 0!");
        res.redirect("/players");
      }
    }
  }

  edit(req, res, next) {
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
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
    if (data.user.isAdmin) {
      const playerID = req.params.playerID;
      Player.findById(playerID)
        .then((player) => {
          res.render("editPlayer", {
            title: "The detail of Player",
            player: player,
            clubList: clubData,
            isCaptainList: isCaptain,
            message: "",
            nations: nationList,
            positions: positionList,
          });
        })
        .catch(next);
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/players");
    }
  }
  update(req, res, next) {
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
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
    if (data.user.isAdmin) {
      const playerID = req.params.playerID;
      if (req.body.goals > 0) {
        Player.updateOne({ _id: playerID }, req.body)
          .then(() => {
            req.flash("success_msg", "Update success!");
            res.redirect("/players");
          })
          .catch(() =>
            Player.findById(playerID).then((player) => {
              req.flash("error", "Player name already exist!");
              res.redirect(`/players/edit/${playerID}`);
            })
          );
      } else {
        req.flash("error_msg", "Goals must lager than 0!");
        res.redirect(`/players/edit/${playerID}`);
      }
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/players");
    }
  }

  delete(req, res, next) {
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
    if (data.user.isAdmin) {
      const playerID = req.params.playerID;
      Player.findByIdAndDelete({ _id: playerID })
        .then(() => {
          res.redirect("/players");
        })
        .catch(next);
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/players");
    }
  }

  details(req, res, next) {
    const playerID = req.params.playerID;
    Player.findById(playerID)
      .then((player) => {
        console.log(player);
        res.render("detailOfPlayer", {
          title: `Details of ${player.name}`,
          player: player,
        });
      })
      .catch(next);
  }
}

module.exports = new playerController();
