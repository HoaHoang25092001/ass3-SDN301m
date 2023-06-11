var express = require("express");
var router = express.Router();
const playerController = require("../controller/playerController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
