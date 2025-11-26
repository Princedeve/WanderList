const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings = require("./router/listings.js");
const reviews = require("./router/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,// expire date of this cookie
        httpOnly: true,// use for security perpose like crose scripting attacks  
    },
};

app.get("/", (req, res)=>{
    res.send("Hi, i am root");
});

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Restructuring Listings
app.use("/listings", listings);

//Restructuring Reviews
app.use("/listings/:id/reviews", reviews);


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

