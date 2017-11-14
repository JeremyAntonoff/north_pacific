const express = require('express');
const router = express.Router();
const multer = require('multer');
const Blog = require('../models/blogs');
const passport = require('passport');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/imgs/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.jpg');
  }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  Blog.find({}, (err, foundBlogs) => {
    if (err) {
      req.flash('error', err);
      res.redirect('/blog');
    } else {
      res.render('blog/index', { page: 'blog', blogs: foundBlogs });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('blog/login', { page: 'login' });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/blog',
    failureRedirect: '/blog/login',
    failureFlash: true,
    successFlash: 'Welcome back!'
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out!');
  res.redirect('/blog');
});

router.post('/', isLoggedIn, upload.single('image'), (req, res) => {
  if (req.file) {
    req.body.blog.image = req.file.filename;
  } else {
    req.body.blog.image = '/water.jpg';
  }
  Blog.create(req.body.blog, (err, blog) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      res.redirect('/blog');
    } else {
      req.flash('success', 'Your have successfully created a new blog!');
      res.redirect('/blog');
    }
  });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('blog/new', { page: 'new' });
});

router.get('/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      res.redirect('/blog');
    } else {
      res.render('blog/show', { page: 'blog', blog: foundBlog });
    }
  });
});

router.get('/:id/edit', isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      res.redirect(`/blog/${req.params.id}`);
    } else {
      res.render('blog/edit', { page: 'blog', blog: foundBlog });
    }
  });
});

router.put('/:id', isLoggedIn, upload.single('image'), (req, res) => {
  if (req.file) {
    req.body.blog.image = req.file.filename;
  }
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      res.redirect(`/blog/${req.params.id}`);
    } else {
      req.flash('success', 'Your blog post has been updated!');
      res.redirect(`/blog/${req.params.id}`);
    }
  });
});

router.delete('/:id', isLoggedIn, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      res.redirect(`/blog/${req.params.id}`);
    } else {
      req.flash('success', 'Your blog post has been deleted!');
      res.redirect('/blog');
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/blog/login');
  }
}

module.exports = router;
