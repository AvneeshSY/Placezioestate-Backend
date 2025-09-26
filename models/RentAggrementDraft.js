const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    place: String,
    date: String,
    month: String,
    ownerName: String,
    ownerFatherName: String,
    ownerAddress: String,
    tenantName: String,
    tenantFatherName: String,
    rendDate: String,
    endDate: String,
    monthlyRent: String,
    rentPeriod: String,
    aggrementEndDate: String,
    maintenanceCharge: String,
    securityMoney: String,
    securityMoneyModeOfPayment: String,
    noticePeriod: String,
    rentIncrementPercent: String,
    state: String,
    rentAggrementType: String,
    email: String
}, { timestamps: true });

module.exports = mongoose.model('RentalAggrementDraft', rentalSchema);
