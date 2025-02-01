const express = require("express")
const AuthControllers = require("../controllers/auth")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync")

//models
const passport = require("passport")
const { types } = require("joi")


router.route("/register")
    .get(AuthControllers.registerForm)
    .post(wrapAsync(AuthControllers.register))


router.route("/login")
    .get(AuthControllers.loginForm)
    .post(passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: {
            type: "error_msg",
            msg: "Invalid username or password"
        }
    }), AuthControllers.login)

router.post("/logout", AuthControllers.logout)

module.exports = router