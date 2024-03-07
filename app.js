const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const expressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const review = require("./models/review");

mongoose
    .connect("mongodb://localhost:27017/yelp-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
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
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((detail) => detail.message);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// GET ----------------------------------------
app.get("/", (req, res) => {
    res.render("home");
});

app.get(
    "/campgrounds",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.get(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/show", { campground });
    })
);

app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", { campground });
    })
);

// POST ----------------------------------------
app.post(
    "/campgrounds",
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.post(
    "/campgrounds/:id/reviews",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// PUT ----------------------------------------
app.put(
    "/campgrounds/:id",
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// DELETE ----------------------------------------
app.delete(
    "/campgrounds/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    })
);

// ERROR HANDLING ----------------------------------------
app.all("*", (req, res, next) => {
    next(new expressError("ページが見つかりません", 404));
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
