const express = require("express");
const router = express.Router();
const Post = require("../models/Post.js");

//add a post
router.post("/", (req,res) => {
    // console.log(req.body);
    const post = new Post();
    post.title = req.body.title;
    post.description = req.body.description;
    post.author = req.body.author;
    post.save();

    return res.json(post);
});
//view all post

router.get("/", (req,res) => {
    Post.find({}, (err, posts) => {
        return res.json(posts);
    })
})
// view single post by id
router.get("/:id", (req,res) => {
    Post.findOne({_id:req.params.id}, (err, post) =>{
        return res.json(post);
    });
})
//edit a post
router.put("/:id", (req,res) => {
    const post = {};
    post.title = req.body.title;
    post.description = req.body.description;
    post.author = req.body.author;

    //findOneandUpdate(filter, theNewOjbect, {new:true}, callback function)
    Post.findOneAndUpdate({_id:req.params.id}, post, {new:true}, (err, updatedPost) => {
        return res.json(updatedPost);
    })
})
//delete a post
router.delete("/:id", (req,res)=>{
    Post.findOneAndDelete({_id:req.params.id}, (err,post) => {
        return res.json(post);
    })
})
module.exports = router;