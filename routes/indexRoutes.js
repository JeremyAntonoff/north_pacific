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
  });
});

module.exports = router;
