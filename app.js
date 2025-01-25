const express = require('express')
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const port = 3000


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


app.get('/', (req, res) => {
    res.render("home")
    // res.send('Hello World!')
})


app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}`))