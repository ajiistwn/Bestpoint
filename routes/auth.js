const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync")

//models
const User = require("../models/user")
const passport = require("passport")
const { types } = require("joi")

router.get("/register", (req, res) => {
    res.render("auth/register")
})


router.post("/register", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        req.login(registerUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success_msg", "You are registered and logged in")
            res.redirect("/places")
        })

    } catch (error) {
        req.flash("error_msg", error.message)
        res.redirect("/register")
    }
}))

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
        type: "error_msg",
        msg: "Invalid username or password"
    }
}), (req, res) => {
    req.flash("success_msg", "You are logged in")
    res.redirect("/places")
})

router.post("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash("success_msg", "You are logged out")
        res.redirect("/login")
    })
})

module.exports = router