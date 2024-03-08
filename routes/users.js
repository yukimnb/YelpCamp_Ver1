const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const review = require("../models/review");

// GET ----------------------------------------
router.get("/register", (req, res) => {
    res.render("users/register");
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

// POST ----------------------------------------
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        await User.register(user, password);
        req.flash("success", "Yelp Campへようこそ");
        res.redirect("/campgrounds");
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
