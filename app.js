var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser');



app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.render("index")
});

app.listen(3000,function() {
  console.log('server has started')
});
