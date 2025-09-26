const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    propertyType: {
        type: String, // Changed to a simple string
        required: true,
    },
    propertyImages: {
        type: [],
     
    },
}, {
    timestamps: true, // To store the creation and update timestamps
});

const List_Property = mongoose.model('List_Property', propertySchema); // Model name updated

module.exports = List_Property;
