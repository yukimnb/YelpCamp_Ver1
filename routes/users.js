const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// GET ----------------------------------------
router.get("/register", (req, res) => {
    res.render("users/register");
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "ログアウトしました");
        res.redirect("/campgrounds");
    });
});

// POST ----------------------------------------
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerdUser = await User.register(user, password);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Yelp Campへようこそ");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "ログインしました");
    res.redirect("/campgrounds");
});

module.exports = router;
