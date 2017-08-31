var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String
})

module.exports = mongoose.model("Blog", blogSchema);
