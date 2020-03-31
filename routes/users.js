const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", (req,res)=>{
    //username mus be greater than 8 characters
    if(req.body.username.length <8) return res.status(400).json({message: "Username must be greater than 8 characters"});
    //password mst be greater than 8 characters
    if(req.body.password.length <8) return res.status(400).json({message: "Password must be greater than 8 characters"});
    // passworrdassword must be equal to password 2
    if(req.body.password != req.body.password2) return res.status(400).json({message: "Password does not match"});

    User.findOne({username:req.body.username}, (err,user)=>{
        if(user) return res.status(400).json({message: "Username already exists!"})
      
        // bcrypt.hash(stringpassword, roundsOfSalt, (err, hashedPassword)=>);
        bcrypt.hash(req.body.password, 10, (err,hashedPassword) => {
            const user = new User();
            user.fullname = req.body.fullname;
            user.username = req.body.username;
            user.password = hashedPassword;
            user.save();

            return res.status(200).json(user);
        })
    })
});

router.post("/login", (req,res)=> {
    User.findOne({username:req.body.username}, ['username', 'password','fullname'],(err,user)=>{
        if(!user) return res.status(404).send("No user found");
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            
            if(!result){ 
                return res.status(401).json({
                    auth:false,
                    message: "Invalid Credentials",
                    token: null
                })
            }else{
                let token = jwt.sign(user.toJSON(), 'b49-blog', {expiresIn: '1h'});
                return res.status(200).json({
                    auth:true,
                    message: "Logged in successfully",
                    token
                })
            }
        })
        
    })
})
//find all

router.get("/", (req,res)=>{
    User.find({}, (err,users)=>{
        return res.json(users);
    })
})
//find one
router.get("/:id", (req,res)=>{
    User.findOne({_id:req.params.id}, (err,user)=>{
        return res.json(user);
    })
})
// update user

router.put("/:id", (req,res)=>{
    const user = {}
    user.fullname = req.body.fullname;
    user.username = req.body.username;
    user.password = req.body.password;

    
    User.findOneAndUpdate({_id:req.params.id}, user, {new:true}, (err,updatedUser)=>{
        return res.json(updatedUser);
    });
})

delete user

router.delete("/:id", (req, res) => {
    User.findOneAndDelete({_id:params.req.id}, (err,user)=>{
        return res.json(user);
    })
})
module.exports = router;