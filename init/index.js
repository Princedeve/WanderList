const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderList";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");
}

const initDB = async () => {

    // Demo/seed database ko fresh start karne ke liye
    await Listing.deleteMany({});

    const owners = [
        "69355ef54a90cc72e2338aa2",
        "6935576f0a88abd1fbb9db4d",
        "693552153dd0a11db4515e94",
        "69368bd994cce9b27d86d1d0"
    ];

    const newData = [];

    for (const obj of initData.data) {

        const query = encodeURIComponent(
            `${obj.location}, ${obj.country}`
        );

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`,
            {
                headers: {
                    "User-Agent": "WanderList/1.0"
                }
            }
        );

        if (!response.ok) {
            console.log(`Geocoding failed: ${obj.location}`);
            await sleep(1100);
            continue;
        }

        const data = await response.json();

        if (data.length > 0) {

            obj.geometry = {
                type: "Point",
                coordinates: [
                    Number(data[0].lon),
                    Number(data[0].lat)
                ]
            };

            console.log(`Location found: ${obj.location}`);

        } else {

            console.log(`Location not found: ${obj.location}`);
        }

        newData.push({
            ...obj,
            owner: owners[Math.floor(Math.random() * owners.length)]
        });

        // Nominatim request limit ko respect karne ke liye
        await sleep(1100);
    }

    await Listing.insertMany(newData);

    console.log("Demo data initialized successfully!");
};

main()
    .then(async () => {
        await initDB();
        await mongoose.connection.close();
        console.log("Database connection closed");
    })
    .catch(async (err) => {
        console.log(err);
        await mongoose.connection.close();
    });