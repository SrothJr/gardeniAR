const mongoose = require('mongoose');

const CompanionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companions: { type: [String], default: [] },
    avoided: { type: [String], default: [] },
}, { collection: 'companion' }); // <- explicitly set collection name

module.exports = mongoose.model('Companion', CompanionSchema);
