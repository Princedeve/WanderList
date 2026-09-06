const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isReviewAuthor, isLoggedIn, isOwner} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//Reviews
//Post review Route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

//Delete Reveiw Route and update route
router.route("/:reviewId")
.delete(isLoggedIn, isReviewAuthor, 
    wrapAsync(reviewController.destroyReview)
)
.put( isLoggedIn, isReviewAuthor, 
    wrapAsync(reviewController.updateReview)
);

//Edit Route
router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.renderEditForm));


module.exports = router;