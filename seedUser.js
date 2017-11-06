const User = require('./models/user.js');
const mongoose = require('mongoose');

function seedUser() {
  User.register(
    new User({ username: process.env.USERNAME }),
    process.env.PASSWORD,
    (err, user) => {
      if (err) {
        console.log(err);
      }
    }
  );
}
module.exports = seedUser;
