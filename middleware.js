module.exports.isLoggedIn = (req, res, next) =>{
    // console.log("middleware are checking: ",req.user);
    // console.log(req.path, "..", req.originalUrl);
     if(!req.isAuthenticated()){
        req.flash("error", "you must be logged in to create listing!");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};