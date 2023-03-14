//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
require('dotenv').config();
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongooseConnect().catch(err => console.log(err));

async function mongooseConnect(){
  await mongoose.connect(process.env.DB_ADDRESS);
}

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res){
  const allPosts = await Post.find({});
  res.render("home", {
    posts: allPosts
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  const newPost = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  await newPost.save();

  res.redirect("/");

});

app.get("/posts/:postID", async function(req, res){
  const selectedPost = await Post.findById(req.params.postID);
  res.render("post", {
    title: selectedPost.title,
    content: selectedPost.body
  })
});

app.listen(process.env.port || 3000, function() {
  console.log("Server started on port 3000");
});
