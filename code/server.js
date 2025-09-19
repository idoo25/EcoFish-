const express = require('express');
const path = require('path');
const youtubeApi = require('./api/youtube');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files (if you have a frontend build)
app.use(express.static(path.join(__dirname, 'code')));

// API routes
app.use('/api', youtubeApi);

// Fallback for SPA routing (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'code', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
