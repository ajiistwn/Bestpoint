const Place = require("../models/place")
const fs = require("fs")
const ExpressError = require("../utils/ErrorHandler")


module.exports.index = async (req, res) => {
    const places = await Place.find()
    res.render("places/index", { places })
}

module.exports.store = async (req, res, next) => {
    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))
    const { title, location, price, description, image } = req.body

    const place = new Place({ title, location, price, description, image })
    place.author = req.user._id
    place.images = images

    await place.save()

    req.flash("success_msg", "Place added successfully")
    res.redirect("/places")
}

module.exports.show = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("author")
    res.render("places/show", { place })
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    res.render("places/edit", { place })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const { title, location, price, description } = req.body
    const place = await Place.findByIdAndUpdate(id, { title, location, price, description })
    if (req.files && req.files.length > 0) {

        place.images.forEach(image => {
            fs.unlink(image.url, err => new ExpressError(err))
        });

        //update data gambar di mongo
        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }))
        place.images = images
        place.save()
    }

    req.flash("success_msg", "Place updated successfully")
    res.redirect("/places")
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    if (place.images && place.images.length > 0) {

        place.images.forEach(image => {
            fs.unlink(image.url, err => new ExpressError(err))
        })

    }

    await place.deleteOne(place)

    req.flash("success_msg", "Place deleted successfully")
    res.redirect("/places")
}

module.exports.destroyImage = async (req, res) => {
    try {
        const { id } = req.params
        const { images } = req.body
        if (!images || images.length === 0) {
            req.flash("error_msg", "Please select at least one image")
            return res.redirect(`/places/${id}/edit`)
        }

        images.forEach(image => {
            fs.unlinkSync(image)
        })

        await Place.findByIdAndUpdate(
            id,
            { $pull: { images: { url: { $in: images } } } }
        )
        req.flash("success_msg", "Successfully delete images")
        return res.redirect(`/places/${id}/edit`)

    } catch (err) {
        new ExpressError(err)
    }
}