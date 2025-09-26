const mongoose = require('mongoose');

const rentApartmentSchema = new mongoose.Schema({
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society_Rent', required: true },
    societyName: { type: String, required: true },
    furnished: { type: String, required: true },
    bhk: { type: Number, required: true },
    facilities: { type: [String], required: true },
    address: { type: String, required: true },
    mapLocation: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    mainImage: { type: String },
    otherImages: { type: [String] },
}, { timestamps: true });

const RentApartment = mongoose.model('RentApartment', rentApartmentSchema);

module.exports = RentApartment;
