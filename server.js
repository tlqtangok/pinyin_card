const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (including sounds directory)
app.use(express.static('public'));

// API endpoint to get all available pinyin syllables
app.get('/api/syllables', (req, res) => {
  const soundsPath = path.join(__dirname, 'public', 'sounds');
  
  try {
    const directories = fs.readdirSync(soundsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    res.json({ syllables: directories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load syllables' });
  }
});

app.listen(PORT, () => {
  console.log(`🎉 Pinyin Kids App is running on http://localhost:${PORT}`);
});
