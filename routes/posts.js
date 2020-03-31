const express = require("express");
const router = express.Router();
const Post = require("../models/Post.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

//add a post
router.post("/", (req,res) => {
    // console.log(req.body);

    let token = req.headers['x-auth-token']
    let decoded = jwt.verify(token, 'b49-blog')
    if(!token) return res.status(401).json({message:"You are not logged in"});
    if(decoded){
        const post = new Post();
        post.title = req.body.title;
        post.description = req.body.description;
        post.author = decoded.username;
        post.save();
    
        return res.json(post);    
    }
    
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
    let token = req.headers['x-auth-token']
    if(!token) return res.status(401).json({message: "Unauthorized"})
    let decoded = jwt.verify(token, 'b49-blog')

    if(decoded){
        Post.findOne({_id:req.params.id}, (err, post) =>{
            if(post.author == decoded.username){
                post.title = req.body.title
                post.description = req.body.description
                post.save((err) => {
                    if(err){
                        return res.status(500).json({message: "Server error"})
                    }else{
                        return res.status(200).json(post)
                    }
                })
            }else{
                return res.status(401).json({message:"You are not the owner of this post"});
            }

        })
        // User.findOne({username:decoded.username}, (err,user)=>{
        //     Post.findOne({author:decoded.username}, (err,post)=>{
        //         if(post.username == decoded.username){
        //             const post = {};
        //             post.title = req.body.title;
        //             post.description = req.body.description;
                    
        //             //findOneandUpdate(filter, theNewOjbect, {new:true}, callback function)
        //             Post.findOneAndUpdate({_id:req.params.id}, post, {new:true}, (err, updatedPost) => {
        //                 return res.json(updatedPost);
        //             })
        //         }
        //     })
        // })
    }

    
})
//delete a post
router.delete("/:id", (req,res)=>{

    let token = req.headers[x-auth-token]
    if(!token) return res.status(401).json({message: "Unauthorized"})
    let decoded = jwt.verify(token, 'b49-blog')
    if(decoded){
        Post.findOne({username:decoded.username}, (err,post)=>{
            if(post.username == decoded.username){
                Post.findOneAndDelete({_id:req.params.id}, (err,post) => {
                    return res.json(post)
                })
            }
        })
    }
    // Post.findOneAndDelete({_id:req.params.id}, (err,post) => {
    //     return res.json(post);
    // })
})
module.exports = router;