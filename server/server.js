const express = require('express');
const cors = require('cors');
const keyword = require('./data/keyword.json');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/keyword', (req, res) => {
  res.json(keyword.result);
});

// ex - /autoComplete?keyword=mango
app.get('/autoComplete', (req, res) => {
  const userInput = req.query.keyword;
  const suggestion = keyword.result.filter(item => item.keyword.includes(userInput));
  res.json(suggestion);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
