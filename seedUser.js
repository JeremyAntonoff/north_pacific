var User = require("./models/user.js");
var mongoose = require('mongoose');

function seedUser() {
  User.register(new User({username: process.env.USERNAME}), process.env.PASSWORD, function(err, user) {
    if (err) {
      console.log(err);
    }
  })
}
module.exports = seedUser;
