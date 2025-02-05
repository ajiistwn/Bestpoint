const ExpressError = require("./ErrorHandler")
const baseUrl = "https://geocode.search.hereapi.com/v1"
const apikey = "vipFwptHjp4Gyhjl9a6TZJT_CbVQ5pLg5LEvFhfNj3g"

const geocode = async (address) => {
    const url = `${baseUrl}/geocode?q=${address}&limit=1&apikey=${apikey}`
    try {
        const response = await fetch(url)
        const data = await response.json()
        // const lat = data.items.[0].position.lat
        // const lng = data.items[0].position.lng
        return data.items[0].position
    } catch (err) {
        throw new ExpressError(err.message, 500)
    }

}

const geometry = async (address) => {
    try {
        const position = await geocode(address)
        console.log(position)
        return {
            type: "Point",
            coordinates: [position.lng, position.lat,]
        }
    } catch (err) {
        throw new ExpressError(err.message, 500)
    }
}

module.exports = {
    geocode,
    geometry
}