const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "そのアクションの権限がありません");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((detail) => detail.message);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((detail) => detail.message);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
