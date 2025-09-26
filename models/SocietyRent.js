const mongoose = require('mongoose');

const societyRentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    facilities: {
        type: [String],
        required: true,
    },
    one_bhk_rent: {
        type: String,
        required: true,
    },
    two_bhk_rent: {
        type: String,
        required: true,
    },
    three_bhk_rent: {
        type: String,
        required: true,
    },
    mapLocation: {
        type: String,
        required: true,
    },
    mainImage: {
        type: String,
        // required: true,
    },
    otherImages: {
        type: [String],
        required: false,
  
    },
}, { timestamps: true });

const SocietyRent = mongoose.model('Society_Rent', societyRentSchema);

module.exports = SocietyRent;
