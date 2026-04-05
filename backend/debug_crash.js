require('dotenv').config();
const { analyzeText } = require('./controllers/analyze.controller');

// Mock req and res
const req = {
    body: {
        text: "Iran-Israel war LIVE: Destroyed U.S. aircraft searching for missing pilot, claim Iran Guards"
    }
};

const res = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        console.log('--- BACKEND RESPONSE ---');
        console.log('Status:', this.statusCode || 200);
        console.log('Data:', JSON.stringify(data, null, 2));
    }
};

async function debugScan() {
    console.log('🚀 Starting Deep Debug Scan...');
    try {
        // We'll call the controller directly to see full pipeline logs in console
        const { extractClaims } = require('./services/claimExtractor.service');
        const { gatherEvidence } = require('./services/evidenceGatherer.service');
        const { analyzeWithEvidence } = require('./services/analyzer.service');
        
        console.log('1. Extracting...');
        const claims = await extractClaims(req.body.text);
        
        console.log('2. Evidence...');
        const evidence = await gatherEvidence(claims.coreTopic);
        
        console.log('3. Analyzing...');
        const result = await analyzeWithEvidence(req.body.text, evidence);
        
        console.log('✅ Final Result SUCCESS');
    } catch (e) {
        console.error('❌ PIPELINE CRASHED:', e.message);
        console.error(e.stack);
    }
}

debugScan();
