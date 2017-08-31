var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    nodeMailer      = require('nodemailer'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    User            = require('./models/user.js'),
    Blog            = require("./models/blogs")
    express_session = require("express-session"),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    seedUser        = require('./seedUser'),
    multer          = require('multer')


// seedUser();
mongoose.connect('mongodb://localhost/north_pacific', {useMongoClient: true});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})
var upload = multer({ storage: storage });
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express_session({
  secret: 'secret phrases are underrated',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
app.use(function(req, res, next) {
  res.locals.user = req.user
  next();
})


app.get("/", function(req, res) {
  res.render("index", {page: 'home'})
});

app.get("/menu", function(req, res) {
  res.render("menu", {page: 'menu'})
});

app.get("/story", function(req, res) {
  res.render("story", {page: 'story'})
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

app.get("/blog", function(req, res) {
  Blog.find({}, function(err, foundBlogs) {
    if (err) {
      console.log(err)
    } else {
      res.render('blog/index', {page: 'blog', blogs: foundBlogs})
    }
  })
});

app.get('/blog/login', function(req, res) {
  res.render("blog/login", {page: 'login'})
});

app.post("/blog/login", passport.authenticate("local", {
  successRedirect: "/blog",
  failureRedirect: "/blog/login"
  }), function(req, res) {
});

app.get("/blog/logout",function(req, res) {
  req.logout();
  res.redirect("/blog")
});

app.post("/blog", upload.single("image"), function(req, res, next) {
  req.body.blog.image = req.file.filename
  console.log(req.body.blog)
  Blog.create(req.body.blog, function(err, blog) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/blog");
    }
  })
});

app.get("/blog/new", function(req, res) {
  res.render("blog/new", {page: 'new'})
});



app.get("/blog/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err)
    } else {
      res.render("blog/show", {page: 'blog', blog: foundBlog})
    }
  });
});

app.get("/blog/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err)
    } else {
      res.render("blog/edit", {page: 'blog', blog: foundBlog})
    }
  });
});

app.put("/blog/:id", upload.single("image"), function(req, res) {
  if (req.file) {
    req.body.blog.image = req.file.filename
  }
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      console.log(error)
    } else {
      res.redirect("/blog/" + req.params.id)
    }
  })
});

app.delete("/blog/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/blog")
    }
  })
})


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/blog/login")
  }
}

app.listen(3000,function() {
  console.log('server has started')
});
