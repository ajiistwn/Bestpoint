const Place = require("../models/place")

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
    const { title, location, price, description, image } = req.body
    await Place.findByIdAndUpdate(id, { title, location, price, description, image })
    req.flash("success_msg", "Place updated successfully")
    res.redirect("/places")
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndDelete(id)
    req.flash("success_msg", "Place deleted successfully")
    res.redirect("/places")
}