const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listing = require("./router/listings.js");
const review = require("./router/review.js");

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

//Restructuring Listings
app.use("/listings", listing);

//Restructuring Reviews
app.use("/listings/:id/reviews", review);


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