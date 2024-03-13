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
    const resImage = await axios.get("https://api.unsplash.com/photos/random", config);
    const resImage2 = await axios.get("https://api.unsplash.com/photos/random", config);
    const resImage3 = await axios.get("https://api.unsplash.com/photos/random", config);
    for (let i = 0; i < 50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 2000) + 1000;
        const camp = new Campground({
            author: "65ea69549e7ff53456fd2c7f",
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae.",
            price,
            images: [
                {
                    url: resImage.data.urls.regular,
                    filename: resImage.data.id,
                },
                {
                    url: resImage2.data.urls.regular,
                    filename: resImage2.data.id,
                },
                {
                    url: resImage3.data.urls.regular,
                    filename: resImage3.data.id,
                },
            ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
