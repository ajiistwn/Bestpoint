const ErrorHandler = require("../utils/ErrorHandler")

//schemas
const { placeSchema } = require("../schemas/place")
const { reviewSchema } = require("../schemas/review")

module.exports.validatePlace = (req, res, next) => {
    const { title, location, price, description, image } = req.body
    const { error } = placeSchema.validate({ title, location, price, description, image })
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(",")
        return next(new ErrorHandler(msg, 404))
    } else {
        next()
    }

}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(",")
        return next(new ErrorHandler(msg, 404))
    } else {
        next()
    }
}