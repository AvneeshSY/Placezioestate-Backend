// models/Requirement.js
const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!!`,
    },
  },
  gender: {
    type: String,
    // required: true,
  },
  purpose: {
    type: String,
    // required: true,
  },
  requirement: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Requirement = mongoose.model('Requirement', requirementSchema);
module.exports = Requirement;
