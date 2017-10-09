const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
  res.render("index", {page: 'home'})
});

router.get("/menu", function(req, res) {
  res.render("menu", {page: 'menu'})
});

router.get("/story", function(req, res) {
  res.render("story", {page: 'story'})
});

router.post("/contact", function(req, res) {
  console.log(process.env.mailerUSER, process.env.mailerPASS)
  const nodemailer = require('nodemailer');
  let transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
          user: process.env.mailerUSER,
          pass: process.env.mailerPASS
      }
  });

  let mailOptions = {
      from: 'northpacificrestaurant@outlook.com',
      to: 'northpacificrestaurant@gmail.com',
      subject: 'North Pacific Contact Form',
      html: '<h2>' + req.body.name + '<br></h2><h3>' + req.body.phone + '<br><br>' + req.body.message  + '</h3></h2>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.end('failure');
    } else {
    console.log('message-sent')
    res.end('success');
    }
  });
});

module.exports = router;
