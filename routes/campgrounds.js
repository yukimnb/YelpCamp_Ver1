const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// GET ----------------------------------------
router.get("/", catchAsync(campgrounds.index));
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router.get("/:id", catchAsync(campgrounds.showCampground));
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// POST ----------------------------------------
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// PUT ----------------------------------------
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// DELETE ----------------------------------------
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
