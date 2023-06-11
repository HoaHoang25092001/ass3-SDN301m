const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    image: {
      type: String,
      require: true,
    },
    nation: {
      type: Schema.Types.ObjectId,
      ref: "nations",
      require: true,
    },
    club: {
      type: String,
      require: true,
    },
    position: {
      type: String,
      require: true,
    },
    goals: {
      type: Number,
      require: true,
      default: 0,
    },
    isCaptain: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

var Player = mongoose.model("players", playerSchema);
module.exports = Player;
