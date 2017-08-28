var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser');
    nodeMailer = require('nodemailer');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  res.render("index")
});

app.post("/contact", function(req, res) {
  const nodemailer = require('nodemailer');
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: process.env.mailerUSER,
          pass: process.env.mailerPASS
      }
  });

  let mailOptions = {
      from: req.body.name,
      to: 'northpacificrestaurant@gmail.com',
      subject: 'North Pacific Contact Form',
      html: '<h2>' + req.body.name + '<br></h2><h3>' + req.body.phone + '<br><br>' + req.body.message  + '</h3></h2>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.end('failure');
    } else {
    console.log('message-sent')
    res.end('success');
    }
  })
});

app.listen(3000,function() {
  console.log('server has started')
});
