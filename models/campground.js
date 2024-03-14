const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
    {
        title: String,
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        images: [
            {
                url: String,
                filename: String,
            },
        ],
    },
    opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href="/campgrounds/${
        this._id
    }">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});
module.exports = mongoose.model("Campground", campgroundSchema);
