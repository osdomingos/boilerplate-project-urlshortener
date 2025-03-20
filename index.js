require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

let shortUrl = 0;

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

app.post('/api/shorturl', (req, res) => {
  shortUrl++;

  console.log("Recebido:", req.body);

  let url = new URL(req.body.url).hostname;
  
  dns.lookup(url, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    res.json({ original_url: req.body.url, short_url: shortUrl });
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

