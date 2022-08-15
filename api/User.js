const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');
//Password handling
const bcrypt = require('bcrypt')
//Login
router.post('/login', (req, res)=>{
    let {email, password} = req.body;
    email = email.trim()
    password = password.trim(); 
    if (email === "", password === "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        });
    }else{
        //check if user exist
        User.find({email}).then(data => {
            if (data.length) {
                //user exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result =>{
                    if (result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Login successful",
                            data: data
                        })
                    }else{
                        res.json({
                            status: "FAILED",
                            message: "Wrong password entered",
                        })
                    }
                }).catch(err =>{
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while comparing password",
                    })
                })
            }else{
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered",
                })
            }
        }).catch(err =>{
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user",
            })
        })
    }
})
//Signup
router.post('/signup', (req, res)=>{
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim()
    email = email.trim()
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name === "" || email === "", password === "", dateOfBirth ==="") {
        res.json({
            status: "FAILED",
            message: "Empty imput fields"
        });
    } else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Invalid name"
        })
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email"
        })
    } else if(!new Date(dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date of birth"
        })
    } else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    }else {
        User.find({email}).then(result =>{
            if (result.length) {
                //user already exist
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else{
                //try to store the user in the db 

                const rounds = 10;
                bcrypt.hash(password, rounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });
                    newUser.save().then(result =>{
                        res.json({
                            status: "SUCCESS",
                            message: "Account successfully created",
                            data: result
                        })
                    }).catch(err =>{
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while saving user account"
                        }) 
                    })
                }).catch(err =>{
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing password "
                    }) 
                })
            }
        }).catch(err =>{
            console.log(err)
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user"
            })
        })
    }
})

module.exports = router;