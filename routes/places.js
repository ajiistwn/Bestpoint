const express = require("express")
const PlaceController = require("../controllers/places")
const ErrorHandler = require("../utils/ErrorHandler")
const wrapAsync = require("../utils/wrapAsync")
const isValidObjectId = require("../middlewares/isValidObjectId")
const router = express.Router()



//models
const Place = require("../models/place")

//schemas
const { placeSchema } = require("../schemas/place")

//middleware
const isAuth = require("../middlewares/isAuth")
const { isAuthorPlace } = require("../middlewares/isAuthor")
const validatePlace = (req, res, next) => {
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


router.route("/")
    .get(wrapAsync(PlaceController.index))
    .post(isAuth, validatePlace, wrapAsync(PlaceController.store))

router.get('/create', isAuth, (req, res) => {
    res.render("places/create")
})

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId("/places"), wrapAsync(PlaceController.edit))


router.route("/:id")
    .get(isValidObjectId("/places"), wrapAsync(PlaceController.show))
    .put(isAuth, isAuthorPlace, isValidObjectId("/places"), validatePlace, wrapAsync(PlaceController.update))
    .delete(isAuth, isAuthorPlace, isValidObjectId("/places"), wrapAsync(PlaceController.destroy))





module.exports = router