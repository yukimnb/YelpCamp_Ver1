const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

mongoose
    .connect("mongodb://localhost:27017/yelp-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("MongoDB コネクションOK");
    })
    .catch((err) => {
        console.log("MongoDB コネクションエラー");
        console.log(err);
    });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware ----------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "mysecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routing ----------------------------------------
app.get("/", (req, res) => {
    res.render("home");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// ERROR HANDLING ----------------------------------------
app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりません", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "問題が起きました";
    }
    res.status(statusCode).render("error", { err });
});

// LISTEN ----------------------------------------
app.listen(3000, () => {
    console.log("ポート3000でリクエスト待受中...");
});
