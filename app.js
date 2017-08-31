const express       = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    flash           = require('connect-flash')
    User            = require('./models/user.js'),
    Blog            = require('./models/blogs'),
    express_session = require('express-session'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    seedUser        = require('./seedUser'),
    port            = process.env.PORT || 3000,
    url             = process.env.DBURL || 'mongodb://localhost/north_pacific'

const indexRoutes = require("./routes/indexRoutes")
const blogRoutes  = require("./routes/blogRoutes");
mongoose.connect(url, {useMongoClient: true});
// seedUser()
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
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
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
app.use(indexRoutes);
app.use("/blog", blogRoutes);

app.listen(port,function() {
  console.log('server has started')
});
