const mongoose = require("mongoose");
const axios = require("axios");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    const config = {
        params: {
            collections: 483251,
            client_id: process.env.UNSPLASH_ACCESS_KEY,
        },
    };
    for (let i = 0; i < 50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const resImage = await axios.get("https://api.unsplash.com/photos/random", config);
        const price = Math.floor(Math.random() * 2000) + 1000;
        const camp = new Campground({
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
            image: resImage.data.urls.small,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae.",
            price,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
