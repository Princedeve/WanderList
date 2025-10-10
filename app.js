const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { cache } = require("react");

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderList";

main().then((res) => { console.log("connected to DB") }).catch((err) =>{ console.log(err)});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//middelwares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));//for form body req.body parses body of a request.
app.use(express.json());//for json body
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);//for repeated template
app.use(express.static(path.join(__dirname, "public")));//for serve static fils


app.get("/", (req, res)=>{
    res.send("Hi, i am root");
});

// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

//Index Route
app.get("/listings", async(req, res) =>{
   const allListings = await Listing.find({});
   allListings.forEach(l => l.price = Number(l.price));
   res.render("listings/index.ejs", {allListings});
});
//New Route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});
//Show Route
app.get("/listings/:id", async(req, res) =>{
    try{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        
        if(!listing){
            return res.status(404).send("Listing not found");
        }

        res.render("listings/show.ejs", {listing});
    }catch(err){

        console.log(err);
        res.status(500).send("Server error");
    }

});

//Create Route
app.post("/listings", async(req, res, next) => {
    // let listing = req.body.listing;//listing is a object jiske through hm access kar rahe he data ko
    try{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
});

//Edit Route
app.get("/listings/:id/edit", async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
});

app.use((err, req, res, next) =>{
    res.send("something went wrong");
})

app.listen(8080, () =>{
    console.log(`server is listening to port ${8080}`);
});