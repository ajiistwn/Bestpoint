const ExpressError = require("./ErrorHandler")
const baseUrl = "https://geocode.search.hereapi.com/v1"
const apikey = "vipFwptHjp4Gyhjl9a6TZJT_CbVQ5pLg5LEvFhfNj3g"

const geocode = async (address) => {
    const url = `${baseUrl}/geocode?q=${address}&apiKey=${apikey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const lat = data.items[0].position.lat;
        const lng = data.items[0].position.lng;
        return { lat, lng }
    } catch (err) {
        throw new ExpressError(err.message, 500)
    }
}

module.exports.geometry = async (address) => {
    try {
        let position = await geocode(address);
        return {
            type: 'Point',
            coordinates: [position.lng, position.lat]
        }
    } catch (err) {
        throw new ExpressError(err.message, 500)
    }
}