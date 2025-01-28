const ejsMate = require("ejs-mate")
const express = require('express')
const methodOverride = require("method-override")
const Joi = require("joi")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const wrapAsync = require("./utils/wrapAsync")
const ErrorHandler = require("./utils/ErrorHandler")
const port = 3000

mongoose.connect("mongodb://127.0.0.1/bestpoint")
    .then((result) => {
        console.log("success connect to mongodb")
    }).catch((err) => {
        console.log(err)
    })


//models
const Place = require("./models/place")
const Review = require("./models/review")
const { title, nextTick } = require('process')

//schemas
const { placeSchema } = require("./schemas/place")
const { reviewSchema } = require("./schemas/review")

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//mieddleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

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

// app.get("/seed/place", async (req, res) => {
//     const place = new Place({
//         title: "Empire State",
//         price: "$999999",
//         description: "A greet building",
//         location: "New York, NY"
//     })

//     await place.save()
//     res.send(place)
// })

app.post('/places', validatePlace, wrapAsync(async (req, res, next) => {
    const { title, location, price, description, image } = req.body
    const place = new Place({ title, location, price, description, image })
    await place.save()
    res.redirect("/places")
}))

app.get('/places', wrapAsync(async (req, res) => {
    const places = await Place.find()
    res.render("places/index", { places })
}))

app.get('/places/create', (req, res) => {
    res.render("places/create")
})


app.put('/places/:id', validatePlace, wrapAsync(async (req, res) => {
    const { id } = req.params
    const { title, location, price, description, image } = req.body
    await Place.findByIdAndUpdate(id, { title, location, price, description, image })
    res.redirect("/places")
}))

app.delete('/places/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndDelete(id)
    res.redirect("/places")
}))

app.delete('/places/:place_id/reviews/:review_id', wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } })
    await Review.findByIdAndDelete(review_id)
    res.redirect(`/places/${place_id}`)
}))



app.get('/places/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id).populate("reviews")
    res.render("places/show", { place })
}))

app.get('/places/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    res.render("places/edit", { place })
}))

app.post("/places/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const review = new Review(req.body.review)
    const place = await Place.findById(req.params.id)
    place.reviews.push(review)
    await review.save()
    await place.save()
    res.redirect(`/places/${req.params.id}`)
}))


app.get('/', (req, res) => {
    res.render("home")
})

app.all("*", (req, res, next) => {
    next(new ErrorHandler())
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "oh no, Something Want Wrong"
    res.status(statusCode).render("error", { err })
})

app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}`))