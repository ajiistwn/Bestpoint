const express = require("express")
const reviewController = require("../controllers/reviews")
const ErrorHandler = require("../utils/ErrorHandler")
const wrapAsync = require("../utils/wrapAsync")
const isValidObjectId = require("../middlewares/isValidObjectId")
const router = express.Router({ mergeParams: true })

//models
const Review = require("../models/review")
const Place = require("../models/place")

//schemas
const { reviewSchema } = require("../schemas/review")

//middleware
const isAuth = require("../middlewares/isAuth")
const { isAuthorReview } = require("../middlewares/isAuthor")
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(",")
        return next(new ErrorHandler(msg, 404))
    } else {
        next()
    }
}

router.post("/", isAuth, isValidObjectId("/places"), validateReview, wrapAsync(reviewController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId("/places"), wrapAsync(reviewController.destroy))


module.exports = router