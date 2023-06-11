const Nation = require("../models/nation");

var jwt = require("jsonwebtoken");
const config = require("../config/config");
const Player = require("../models/player");

const errMessage = "Nation already exist!";
const authMessage = "Only Admin can do this action!";

class nationController {
  index(req, res, next) {
    var token = req.cookies.accessToken;
    if (token) {
      var data = jwt.verify(req.cookies.accessToken, config.secretKey);
      if (data.user.isAdmin) {
        Nation.find({})
          .then((nation) => {
            res.render("nation", {
              title: "The list of Nations",
              nation: nation,
              checkAdmin: true,
              message: "",
              authMessage: "",
            });
          })
          .catch(next);
      } else {
        Nation.find({})
          .then((nation) => {
            res.render("nation", {
              title: "The list of Nations",
              nation: nation,
              checkAdmin: false,
              message: "",
              authMessage: "",
            });
          })
          .catch(next);
      }
    } else {
      Nation.find({})
        .then((nation) => {
          res.render("nation", {
            title: "The list of Nations",
            nation: nation,
            checkAdmin: false,
            message: "",
            authMessage: "",
          });
        })
        .catch(next);
    }
  }
  create(req, res, next) {
    const nation = new Nation(req.body);
    const nationName = req.body.name;
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
    if (data.user.isAdmin) {
      nation
        .save()
        .then(() => {
          res.redirect("/nations");
        })
        .catch(() => {
          Nation.find({ name: nationName }).then((nation) => {
            res.render("nation", {
              title: "The list of Nations",
              nation: nation,
              message: errMessage,
              checkAdmin: true,
            });
          });
        });
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/nations");
    }
  }

  edit(req, res, next) {
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
    if (data.user.isAdmin) {
      const nationID = req.params.nationID;
      Nation.findById(nationID)
        .then((nation) => {
          res.render("editNation", {
            title: "The list of Nations",
            nation: nation,
            message: "",
          });
        })
        .catch(next);
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/nations");
    }
  }
  update(req, res, next) {
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
    if (data.user.isAdmin) {
      const nationID = req.params.nationID;
      Nation.updateOne({ _id: nationID }, req.body)
        .then(() => {
          res.redirect("/nations");
        })
        .catch(() => {
          Nation.findById(nationID).then((nation) => {
            res.render("editNation", {
              title: "The list of Nations",
              nation: nation,
              message: errMessage,
            });
          });
        });
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/nations");
    }
  }

  delete(req, res, next) {
    var data = jwt.verify(req.cookies.accessToken, config.secretKey);
    if (data.user.isAdmin) {
      const nationID = req.params.nationID;
      Nation.findByIdAndDelete({ _id: nationID })
        .then(() => {
          res.redirect("/nations");
        })
        .catch(next);
    } else {
      req.flash("error_msg", authMessage);
      res.redirect("/nations");
    }
  }
}

module.exports = new nationController();
