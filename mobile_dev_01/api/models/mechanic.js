const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    id_no: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false,
        required: true
      },
    password: { 
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create geospatial index
mechanicSchema.index({ location: '2dsphere' });

// Correct export statement
const Mechanic = mongoose.model("Mechanic", mechanicSchema);
module.exports = Mechanic;  // Fixed the typo here