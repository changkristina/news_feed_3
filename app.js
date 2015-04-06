var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require('method-override');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));

// ./models is a filepath to all the models.
// var db points to the folder models 
var db = require("./models");
//request to server...
app.get('/articles', function(req,res) {
  //query the Article table of the database...	
  db.Article.findAll().then(function(articles) {
  	//dislay the query in this path...and pass the results into the articlesList object.
  	//console.log(articles);
  	res.render("articles/index", {articlesList: articles});
  });
});

app.get('/articles/new', function(req,res) {
  res.render('articles/new');
});

app.post('/articles', function(req,res) {
  db.Article.create({  //creates an instance of the Article model.
  	title: req.body.title, 
  	author: req.body.author, 
  	content: req.body.content, 
  	fiction: req.body.fiction})
  			    .then(function(articles) {
  				      res.redirect('/articles');
  	});
  //console.log(req.body);
});

app.get('/articles/:id', function(req, res) {
  var articleId = req.params.id;
  db.Article.find(articleId)
  			    .then(function(articles) {
  			    	  res.render('articles/article', {articlesList: articles});
  			 });
  //console.log(req.body);
});
app.get('/articles/:id/edit', function(req, res) {
  var articleId = req.params.id;
  db.Article.find(articleId)
            .then(function(articles) {
                res.render('articles/edit', {articlesList: articles});
          });
});

app.put('/articles/:id', function(req, res) {
  var articleId = req.params.id;
  var title = req.body.title;
  var author = req.body.author;
  var content = req.body.content;
  var fiction = req.body.fiction;
  db.Article.find(articleId)
            .then(function(articles) {
              articles.updateAttributes({
                title: title,
                author: author,
                content: content,
                fiction: fiction })
              .then(function(articles) {
                res.redirect(articleId);
              });
            });
});

app.delete('/articles/:id', function (req, res) {
  var articleId = req.params.id;
  db.Article.find(articleId)
            .then(function(articles) {
              articles.destroy()
              .then(function() {
                res.redirect('/articles');
              });
            });
});

app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

app.get('/about', function(req,res) {
  res.render('site/about');
});

app.get('/contact', function(req,res) {
  res.render('site/contact');
});

app.listen(3000, function() {
  console.log('Listening');
});


