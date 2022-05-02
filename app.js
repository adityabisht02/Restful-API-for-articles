const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();



app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

const url = "mongodb://localhost:27017/articles";

mongoose
  .connect(url)
  .then(function () {
    console.log("connection successful");
  })
  .catch(function (e) {
    console.log("Error connecting to DB");
  });

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);


//actions for all articles
app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, article) {
      if (err) {
        res.sendStatus(err);
      }
      res.send(article);
    });
  })

  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;

    const newarticle = new Article({
      title: title,
      content: content,
    });
    newarticle.save(function (err) {
      if (err) {
        res.send("<h1>Something went wrong</h1>");
      }
      res.send(" successfully added " + newarticle);
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send("There was an error");
      }
      res.send("Database entries deleted successfully");
    });
  });

  //actions for a particular article

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, article) {
        if (article) {
          res.send(article);
        }
        res.send("no such article was found");
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set:req.body},                                //set flag ensures only selected fields are updated and others are not removed
      function (err) {
        console.log(req.body.content)
        if (err) {
          res.send("Error");
        }
        res.send("Article updated");
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (err) {
        res.send("Error deleting article");
      }
      res.send("article deleted");
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
