const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");

const campgroundSchema = new Schema({
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
