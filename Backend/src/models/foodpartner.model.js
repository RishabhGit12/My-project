const mongoose = require('mongoose');

// Create Food Partner Schema
const foodPartnerSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String
    }
})

// Create Food Partner Model
const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema);

module.exports = foodPartnerModel;