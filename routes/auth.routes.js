// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose"); // <== has to be added
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

// require (import) middleware functions
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// GET route ==> to display the signup form to users
//                     .: ADDED :.
router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
//                      .: ADDED :.
router.post("/signup", isLoggedOut, (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username,  password } = req.body;

  // make sure users fill all mandatory fields:
  if (!username ||  !password) {
    res.render("auth/signup", {
      errorMessage: "All fields are mandatory. Please provide your username, username and password."
    });
    return;
  }


  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then((userFromDB) => {
      
      res.redirect("/main");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username and username need to be unique. Either username or username is already used."
        });
      } else {
        next(error);
      }
    }); 
});

router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

// POST login route ==> to process form data
//                     .: ADDED :.
router.post("/login", isLoggedOut, (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login."
    });
    return;
  }

  User.findOne({ username }) // <== check if there's user with the provided username
    .then((user) => {
      // <== "user" here is just a placeholder and represents the response from the DB
      if (!user) {
        // <== if there's no user with provided username, notify the user who is trying to login
        res.render("auth/login", { errorMessage: "Email is not registered. Try with other username." });
        return;
      }
      // if there's a user, compare provided password
      // with the hashed password saved in the database
      else if (bcryptjs.compareSync(password, user.password)) {
        // if the two passwords match, render the user-profile.hbs and
        //                   pass the user object to this view
        //                                 |
        //                                 V
        // res.render("users/user-profile", { user });

        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });

        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});


module.exports = router;

