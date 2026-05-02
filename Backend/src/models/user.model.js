 const mongoose =  require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required : true,
        unique: true,
    },
    password: {
        type: String,
    },
},{
    timestamps: true
})

// Create User Model
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;