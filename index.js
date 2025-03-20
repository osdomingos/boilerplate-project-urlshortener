require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let shortUrl = 1;

const urlDatabase = {}; 

app.post('/api/shorturl', (req, res) => {

  console.log("Recebido:", req.body);

  let url = new URL(req.body.url).hostname;
  
  dns.lookup(url, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    urlDatabase[shortUrl] = req.body.url;

    res.json({ original_url: req.body.url, short_url: shortUrl });
  });
});

app.get(`/api/shorturl/:shortUrl`, (req, res) => {
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'Short URL not found' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

