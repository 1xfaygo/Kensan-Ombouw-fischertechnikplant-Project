const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

let latestOpcUaData = {};

// OPC UA demo client will POST data here
app.post('/api/opcua', (req, res) => {
  const data = req.body;
  console.log('📡 Received OPC UA data:', data);

  latestOpcUaData = data; // store most recent values
  res.json({ message: 'Data stored successfully' });
});

// Frontend can GET the latest values
app.get('/api/factory/status', (req, res) => {
  res.json(latestOpcUaData);
});

app.listen(port, () => {
  console.log(`✅ Express API running on http://localhost:${port}`);
});
