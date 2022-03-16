const express = require('express');
const path = require('path');
const search = require('./data/search.json');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/search', (req, res) => {
  res.json(search.result);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
