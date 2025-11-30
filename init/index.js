const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js"); // .. dote for acess model folder

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderList"

main().then((res) => { console.log("connected to DB") }).catch((err) =>{ console.log(err)});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    const newData = initData.data.map(obj => ({
        ...obj,
        owner: "692c058fbca529921b45512f"  // add field here (id/owner)
    }));
    await Listing.insertMany(newData);
    console.log("data was initialized");
}


initDB();