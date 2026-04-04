const { extractClaims } = require('../services/claimExtractor.service');
const { gatherEvidence } = require('../services/evidenceGatherer.service');
const { analyzeWithEvidence } = require('../services/analyzer.service');
const Scan = require('../models/Scan');

// POST /api/analyze
// FIX: Original skipped Stage 1 (claim extraction) entirely
const analyzeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Text is required for analysis.' });
        }

        console.log('\n====== NEW ANALYSIS REQUEST ======');
        console.log('User:', req.user?.id);
        console.log('Input (first 100 chars):', text.substring(0, 100));

        // STAGE 1 — Claim Extraction via Gemini
        const claims = await extractClaims(text);

        // STAGE 2 — Evidence Gathering (Google + Wikipedia in parallel)
        // Use the extracted core topic for more focused search queries
        const searchQuery = claims.coreTopic || text;
        const evidence = await gatherEvidence(searchQuery);

        // Attach extracted claims to evidence context for the analysis prompt
        evidence.extractedClaims = claims.keyClaims;
        evidence.namedEntities = claims.namedEntities;

        // STAGE 3 — Deep Analysis with Gemini
        const analysisResult = await analyzeWithEvidence(text, evidence);

        // STAGE 4 — Save to MongoDB
        const newScan = new Scan({
            userId: req.user.id,
            originalText: text,
            ...analysisResult
        });
        await newScan.save();

        console.log('💾 Scan saved. ID:', newScan._id);
        console.log('==================================\n');

        res.status(200).json(newScan);

    } catch (error) {
        console.error('❌ Analysis Pipeline Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyze/history
// FIX: Route existed in spec but was never implemented
const getScanHistory = async (req, res) => {
    try {
        const scans = await Scan.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select('originalText credibilityScore verdict createdAt');
        res.status(200).json(scans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyze/:id
// FIX: Route existed in spec but was never implemented
const getScanById = async (req, res) => {
    try {
        const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id });
        if (!scan) {
            return res.status(404).json({ error: 'Scan not found.' });
        }
        res.status(200).json(scan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { analyzeText, getScanHistory, getScanById };
