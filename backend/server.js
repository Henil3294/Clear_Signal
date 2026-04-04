require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Clear Signal API is running.' });
});

// FIX: Auth routes were missing — /api/auth/* would 404 without this
app.use('/api/auth', require('./routes/auth.routes'));

// Analysis routes
app.use('/api/analyze', require('./routes/analyze.routes'));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Clear Signal server running on port ${PORT}`));
