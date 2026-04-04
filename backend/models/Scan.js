const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    // FIX: userId was missing — scans couldn't be linked to users
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalText:         { type: String, required: true },
    credibilityScore:     { type: Number, required: true },
    verdict:              { type: String, required: true },
    verifiedClaims:       [String],
    contradictedClaims:   [String],
    unverifiableClaims:   [String],
    sourcesAgreementRate: { type: Number },
    manipulationFlags:    [String],
    biasDirection:        { type: String },
    tone:                 { type: String },
    aiExplanation:        { type: String, required: true },
    fullReportArticle:    { type: String },
    realNewsSources:      [String],
    fakeNewsSources:      [String]
}, { timestamps: true });

module.exports = mongoose.model('Scan', ScanSchema);
