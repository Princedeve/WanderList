const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js"); // .. dote for acess model folder

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderList"

main().then((res) => { console.log("connected to DB") }).catch((err) =>{ console.log(err)});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// const initDB = async () => {
//     await Listing.deleteMany({});
//     const newData = initData.data.map(obj => ({
//         ...obj,
//         owner: "6935576f0a88abd1fbb9db4d"  // add field here (id/owner)
//     }));
//     await Listing.insertMany(newData);
//     console.log("data was initialized");
// }

const initDB = async () => {
    await Listing.deleteMany({});

    const owners = [
        "69355ef54a90cc72e2338aa2",
        "6935576f0a88abd1fbb9db4d",
        "693552153dd0a11db4515e94",
        "69368bd994cce9b27d86d1d0"
    ];

    const newData = initData.data.map(obj => ({
        ...obj,
        owner: owners[Math.floor(Math.random() * owners.length)]  // RANDOM owner
    }));

    await Listing.insertMany(newData);
    console.log("data initialized with random owners");
}

initDB();