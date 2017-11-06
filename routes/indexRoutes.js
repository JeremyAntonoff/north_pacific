const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { page: 'home' });
});

router.get('/menu', (req, res) => {
  res.render('menu', { page: 'menu' });
});

router.get('/story', (req, res) => {
  res.render('story', { page: 'story' });
});

router.post('/contact', (req, res) => {
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
    html: `<h2>${req.body.name}<br></h2><h3>${req.body.phone}<br><br>${req.body
      .message}</h3></h2>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(401).end();
    } else {
      console.log('message-sent');
      res.status(200).end();
    }
  });
});

module.exports = router;
