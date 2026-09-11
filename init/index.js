const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderList";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");
}

const categories = {
    "Cozy Beachfront Cottage": "Trending",
    "Modern Loft in Downtown": "Iconic Cities",
    "Mountain Retreat": "Mountains",
    "Historic Villa in Tuscany": "Trending",
    "Secluded Treehouse Getaway": "Camping",
    "Beachfront Paradise": "Trending",
    "Rustic Cabin by the Lake": "Camping",
    "Luxury Penthouse with City Views": "Iconic Cities",
    "Ski-In/Ski-Out Chalet": "Mountains",
    "Safari Lodge in the Serengeti": "Trending",
    "Historic Canal House": "Iconic Cities",
    "Private Island Retreat": "Trending",
    "Charming Cottage in the Cotswolds": "Trending",
    "Historic Brownstone in Boston": "Iconic Cities",
    "Beachfront Bungalow in Bali": "Amazing Pools",
    "Mountain View Cabin in Banff": "Mountains",
    "Art Deco Apartment in Miami": "Iconic Cities",
    "Tropical Villa in Phuket": "Amazing Pools",
    "Historic Castle in Scotland": "Castles",
    "Desert Oasis in Dubai": "Amazing Pools",
    "Rustic Log Cabin in Montana": "Camping",
    "Beachfront Villa in Greece": "Trending",
    "Eco-Friendly Treehouse Retreat": "Camping",
    "Historic Cottage in Charleston": "Iconic Cities",
    "Modern Apartment in Tokyo": "Iconic Cities",
    "Lakefront Cabin in New Hampshire": "Camping",
    "Luxury Villa in the Maldives": "Trending",
    "Ski Chalet in Aspen": "Mountains",
    "Secluded Beach House in Costa Rica": "Trending"
};

const initDB = async () => {

    const owners = [
        "69355ef54a90cc72e2338aa2",
        "6935576f0a88abd1fbb9db4d",
        "693552153dd0a11db4515e94",
        "69368bd994cce9b27d86d1d0"
    ];

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

        // Category add karo
        obj.category = categories[obj.title] || "Trending";

        // Existing listing ko update karega,
        // nahi hai to new listing create karega
        await Listing.findOneAndUpdate(
            {
                title: obj.title,
                location: obj.location
            },
            {
                ...obj,
                owner: owners[Math.floor(Math.random() * owners.length)]
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        // Nominatim request limit
        await sleep(1100);
    }

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