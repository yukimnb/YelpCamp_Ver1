const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

// GET ----------------------------------------
router.get("/register", users.renderRegister);

router.get("/login", users.renderLogin);

router.get("/logout", users.logout);

// POST ----------------------------------------
router.post("/register", users.register);

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

module.exports = router;
