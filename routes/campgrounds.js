const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

// Middleware ----------------------------------------
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
router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
        console.log(campground);
        if (!campground) {
            req.flash("error", "キャンプ場は見つかりませんでした");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "キャンプ場は見つかりませんでした");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

// POST ----------------------------------------
router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "新しいキャンプ場を登録しました");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// PUT ----------------------------------------
router.put(
    "/:id",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        req.flash("success", "キャンプ場を更新しました");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// DELETE ----------------------------------------
router.delete(
    "/:id",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "キャンプ場を削除しました");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
