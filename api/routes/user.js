const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");


router.post("/signup", (req, res, next) => {
     User.find({ email: req.body.email}) 
     .exec()
     .then(user => {
        if(user) { 
            return res.status(409).json({
                message: "Email Exists"
            })   
        }
     })



    bcrypt.hash(req.body.email, 10, (err, hash) => {

        if (err) {
            return res.status(500).json({ 

                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Schema.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "User Created!"

                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })

        }
    })
});


module.exports = router;
