// models/Translation.js
const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    pdfPath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Export the Translation model
module.exports = mongoose.model('Translation', translationSchema);
