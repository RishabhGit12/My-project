const mongoose = require('mongoose');

// Create Food Schema
const foodSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    video: {
        type : String,
        required : true
    },
    description: {
        type : String
    },
    foodPartner: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "foodPartner",
        required : true
    }
})

// Create Food Model
const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;