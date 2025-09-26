const mongoose = require("mongoose");

const BrokerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        number: { type: String, required: true },
        email: { type: String, required: false },
        workingArea: { type: String, required: true },
        experience: { type: String, required: true },
        sellRent: { type: String, required: true },
        commercialResidentials: { type: String, required: true },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Broker", BrokerSchema);
