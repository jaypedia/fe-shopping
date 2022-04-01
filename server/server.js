const express = require('express');
const cors = require('cors');
const keyword = require('./data/keyword.json');
const banner = require('./data/banner.json');
const searchCategory = require('./data/searchCategory.json');
const category = require('./data/category.json');
const app = express();
const PORT = 3000;
const MAX_RESULT_COUNT = 10;

app.use(cors());

app.get('/keyword', (req, res) => {
  res.json(keyword.result);
});

app.get('/banner', (req, res) => {
  res.json(banner.result);
});

app.get('/searchCategory', (req, res) => {
  res.json(searchCategory.result);
});

app.get('/category', (req, res) => {
  res.json(category.result);
});

// ex - /autocomplete?keyword=mango
app.get('/autocomplete', (req, res) => {
  const userInput = req.query.keyword;
  let suggestion = keyword.result.filter(item => item.keyword.includes(userInput));
  if (suggestion.length > MAX_RESULT_COUNT) {
    suggestion = suggestion.slice(0, MAX_RESULT_COUNT);
  }
  res.json(suggestion);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
