const { date } = require("joi");
const { geometry } = require("./utils/hereMaps");

// geometry("pantai indah kapuk indonesia")
//     .then(geoData => {
//         console.log(geoData);  // geoData berisi data yang diambil
//     })
//     .catch(err => {
//         console.error("Error:", err.message);
//     });

const geocode = async (address) =>{
    data = await geometry(address)
    console.log(data)
}
geocode("pantai indah kapuk indonesia")