const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    yob: {
      type: Number,
      require: true,
    },
    isAdmin: Boolean,
    default: false,
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
