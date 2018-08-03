const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(proxy({
  router: {
    '/related/**' : 'http://localhost:3001',
    '/related/**' : 'http://localhost:3002',
    '/products/**' : 'http://localhost:3003',
    '/reviews/**' : 'http://localhost:3004',
  }
}));

app.get('/', (req, res) => {
  res.redirect('/1');
})

app.use('/*', express.static('./'));

app.listen(3000, () => console.log('Listening on port 3000'));
