const mongoose = require('mongoose');

const sellPropertySchema = new mongoose.Schema({
    mainImage: {
        type: String,
        required: true
    },
    otherImages: {
        type: [String],
        default: []
    },
    propertyPrice: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    furnishedType: {
        type: String,
        required: true
    },
    bhk: {
        type: String,
        required: true
    },
    bed: {
        type: String,
        required: true
    },
    bathroom: {
        type: String,
        required: true
    },
    balcony: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

const SellProperty = mongoose.model('SellProperty', sellPropertySchema);
module.exports = SellProperty;
