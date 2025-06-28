const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ✅ Stores every raw text submission
let receivedData = [];

// ✅ Allow CORS and raw body parsing (text/plain)
app.use(cors());
app.use('/webhook', express.text({ type: 'text/plain', limit: '2mb' }));

// ✅ Serve frontend from /public folder (e.g., index.html)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Webhook endpoint — receives raw GPT output from n8n
app.post('/webhook', (req, res) => {
  const rawText = req.body;

  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ error: 'Invalid raw text received' });
  }

  // Log and store
  console.log(`🧠 Agent data received:\n`, rawText.slice(0, 300));
  receivedData.push({
    text: rawText,
    time: new Date().toISOString()
  });

  res.status(200).json({ status: 'stored', count: receivedData.length });
});

// ✅ Viewer endpoint — returns all stored entries
app.get('/data', (req, res) => {
  res.json(receivedData);
});

// ✅ Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 Viewer running: http://localhost:${PORT}`);
  console.log(`📬 Webhook endpoint: http://localhost:${PORT}/webhook`);
});