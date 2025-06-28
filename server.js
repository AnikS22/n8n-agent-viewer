const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store incoming data
let mergedData = [];

// Serve index.html at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Webhook endpoint to receive data
app.post('/webhook', (req, res) => {
  try {
    const text = JSON.parse(req.body.text);
    mergedData.push(text);
    res.status(200).send('Data received');
  } catch (err) {
    res.status(400).send('Invalid JSON format');
  }
});

// Endpoint to view the merged data
app.get('/data', (req, res) => {
  res.json(mergedData);
});

app.listen(PORT, () => {
  console.log(`🌐 Viewer running on port ${PORT}`);
});