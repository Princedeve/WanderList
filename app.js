const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const { cache } = require("react");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");

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

const validateListing = (req, res, next) =>{
     // let listing = await req.body?.listing;//listing is a object jiske through hm access kar rahe he data ko
    
    // console.log(listing);
    // if(!listing){// 400 means bad request
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Index Route
app.get("/listings", wrapAsync(async(req, res) =>{
   const allListings = await Listing.find({});
   allListings.forEach(l => l.price = Number(l.price));
   res.render("listings/index.ejs", {allListings});
}));
//New Route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});
//Show Route
app.get("/listings/:id",  wrapAsync(async(req, res, next) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings", validateListing,wrapAsync(async(req, res, next) => {
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
})
);

//Edit Route
app.get("/listings/:id/edit",  wrapAsync(async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id",validateListing, wrapAsync( async(req, res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",  wrapAsync(async(req, res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//Reviews
//Post Route
app.post("/listings/:id/reviews", wrapAsync(async(req, res) =>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`);

}));

app.use((req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) =>{
    let {status = 500, message = "Something went wrong!"} = err;
    res.status(status).render("error.ejs", {message});
});

app.listen(8080, () =>{
    console.log(`server is listening to port ${8080}`);
});