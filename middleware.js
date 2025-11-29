module.exports.isLoggedIn = (req, res, next) =>{
    console.log("middleware are checking: ",req.user);
     if(!req.isAuthenticated()){
        req.flash("error", "you must be logged in to create listing!");
        // return res.redirect("/listings");
        return res.redirect("/login");
    }
    next();
}