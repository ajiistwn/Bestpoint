const express = require("express")
const ErrorHandler = require("../utils/ErrorHandler")
const wrapAsync = require("../utils/wrapAsync")
const isValidObjectId = require("../middleware/isValidObjectId")
const router = express.Router()

//models
const Place = require("../models/place")

//schemas
const { placeSchema } = require("../schemas/place")

//middleware
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

router.get('/', wrapAsync(async (req, res) => {
    // const msg = req.flash("success_msg", "place fetched successfully")
    const places = await Place.find()
    res.render("places/index", { places })
}))

router.get('/create', (req, res) => {
    res.render("places/create")
})

router.post('/', validatePlace, wrapAsync(async (req, res, next) => {
    const { title, location, price, description, image } = req.body
    const place = new Place({ title, location, price, description, image })
    await place.save()
    req.flash("success_msg", "Place added successfully")
    res.redirect("/places")
}))


router.get('/:id/edit', isValidObjectId("/places"), wrapAsync(async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    res.render("places/edit", { place })
}))

router.put('/:id', isValidObjectId("/places"), validatePlace, wrapAsync(async (req, res) => {
    const { id } = req.params
    const { title, location, price, description, image } = req.body
    await Place.findByIdAndUpdate(id, { title, location, price, description, image })
    req.flash("success_msg", "Place updated successfully")
    res.redirect("/places")
}))

router.delete('/:id', isValidObjectId("/places"), wrapAsync(async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndDelete(id)
    req.flash("success_msg", "Place deleted successfully")
    res.redirect("/places")
}))

router.get('/:id', isValidObjectId("/places"), wrapAsync(async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id).populate("reviews")
    res.render("places/show", { place })
}))

module.exports = router