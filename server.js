// server.js
const express = require('express');
const whoiser = require('whoiser');
const cors = require('cors');

const app = express();
app.use(cors());

// Function to fetch WHOIS data
async function fetchWhoisData(domain) {
    try {
        const result = await whoiser(domain);
        return result;
    } catch (error) {
        throw new Error('Failed to fetch Whois data');
    }
}

// Route for WHOIS endpoint
app.get('/whois', async (req, res) => {
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is missing' });
    }
    try {
        const result = await fetchWhoisData(domain);
        res.json(result);
    } catch (error) {
        console.error('Failed to fetch Whois data:', error.message);
        res.status(500).json({ error: 'Failed to fetch Whois data' });
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
    process.exit(1);
});

// Start the server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
