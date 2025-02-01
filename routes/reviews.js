const express = require("express")
const reviewController = require("../controllers/reviews")
const wrapAsync = require("../utils/wrapAsync")
const isValidObjectId = require("../middlewares/isValidObjectId")
const router = express.Router({ mergeParams: true })

//middleware
const isAuth = require("../middlewares/isAuth")
const { isAuthorReview } = require("../middlewares/isAuthor")
const { validateReview } = require("../middlewares/validator")

router.post("/", isAuth, isValidObjectId("/places"), validateReview, wrapAsync(reviewController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId("/places"), wrapAsync(reviewController.destroy))


module.exports = router